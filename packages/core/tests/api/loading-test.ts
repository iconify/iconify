import type { QueryModuleResponse } from '@iconify/api-redundancy';
import { addAPIProvider } from '../../lib/api/config';
import type {
	IconifyAPIIconsQueryParams,
	IconifyAPIQueryParams,
} from '../../lib/api/modules';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons, loadIcon, isPending } from '../../lib/api/icons';
import type { IconifyIcon } from '@iconify/types';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return `api-load-test-${prefixCounter < 10 ? '0' : ''}${prefixCounter}`;
	}

	it('Loading few icons', () => {
		return new Promise((fulfill) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();
			let asyncCounter = 0;

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				const item: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons,
				};

				// This callback should be called first
				expect(asyncCounter).toBe(1);
				asyncCounter++;

				// Test input and return as one item
				const expected: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons: ['icon1', 'icon2'],
				};
				expect(item).toEqual(expected);

				return [item];
			};

			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				// This callback should be called after prepareQuery
				expect(asyncCounter).toBe(2);
				asyncCounter++;

				expect(params.type).toBe('icons');

				// Test input
				expect(host).toBe('https://api1.local');
				const expected: IconifyAPIQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons: ['icon1', 'icon2'],
				};
				expect(params).toEqual(expected);

				// Send data
				callback('success', {
					prefix,
					icons: {
						icon1: {
							body: '<path d="" />',
						},
						icon2: {
							body: '<path d="" />',
						},
					},
				});

				// Counter should not have increased after status.done() call becuse parsing result should be done on next tick
				expect(asyncCounter).toBe(3);
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icons
			loadIcons(
				[
					// as icon
					{
						provider,
						prefix,
						name: 'icon1',
					},
					// as string
					provider + ':' + prefix + ':icon2',
				],
				(loaded, missing, pending) => {
					// This callback should be called last
					expect(asyncCounter).toBe(3);
					asyncCounter++;

					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'icon1',
						},
						{
							provider,
							prefix,
							name: 'icon2',
						},
					]);
					expect(missing).toEqual([]);
					expect(pending).toEqual([]);

					expect(
						isPending({
							provider,
							prefix,
							name: 'icon1',
						})
					).toBe(false);
					expect(isPending({ provider, prefix, name: 'icon3' })).toBe(
						false
					);

					fulfill(true);
				}
			);

			// Test isPending
			expect(isPending({ provider, prefix, name: 'icon1' })).toBe(true);
			expect(isPending({ provider, prefix, name: 'icon3' })).toBe(false);

			// Make sure asyncCounter wasn't increased because loading shoud happen on next tick
			expect(asyncCounter).toBe(0);
			asyncCounter++;
		});
	});

	it('Loading one icon with Promise', async () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Icon loader
		const prepareQuery = (
			provider: string,
			prefix: string,
			icons: string[]
		): IconifyAPIIconsQueryParams[] => {
			const item: IconifyAPIIconsQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};

			// Test input and return as one item
			const expected: IconifyAPIIconsQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon1'],
			};
			expect(item).toEqual(expected);

			return [item];
		};

		const sendQuery = (
			host: string,
			params: IconifyAPIQueryParams,
			callback: QueryModuleResponse
		): void => {
			expect(params.type).toBe('icons');

			// Test input
			expect(host).toBe('https://api1.local');
			const expected: IconifyAPIQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon1'],
			};
			expect(params).toEqual(expected);

			// Send data
			callback('success', {
				prefix,
				icons: {
					icon1: {
						body: '<path d="" />',
					},
				},
			});
		};

		setAPIModule(provider, {
			prepare: prepareQuery,
			send: sendQuery,
		});

		// Load icon
		await loadIcon(provider + ':' + prefix + ':icon1');

		// Test isPending
		expect(isPending({ provider, prefix, name: 'icon1' })).toBe(false);
	});

	it('Loading icon with bad name', async () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Icon loader
		const prepareQuery = (
			provider: string,
			prefix: string,
			icons: string[]
		): IconifyAPIIconsQueryParams[] => {
			const item: IconifyAPIIconsQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};

			// Test input and return as one item
			const expected: IconifyAPIIconsQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['BadIconName'],
			};
			expect(item).toEqual(expected);

			return [item];
		};

		const sendQuery = (
			host: string,
			params: IconifyAPIQueryParams,
			callback: QueryModuleResponse
		): void => {
			expect(params.type).toBe('icons');

			// Test input
			expect(host).toBe('https://api1.local');
			const expected: IconifyAPIQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['BadIconName'],
			};
			expect(params).toEqual(expected);

			// Send data
			callback('success', {
				prefix,
				icons: {
					BadIconName: {
						body: '<path d="" />',
					},
				},
			});
		};

		setAPIModule(provider, {
			prepare: prepareQuery,
			send: sendQuery,
		});

		// Load icon: should throw an error
		let loadedIcon = false;
		try {
			await loadIcon(provider + ':' + prefix + ':BadIconName');
			loadedIcon = true;
		} catch {
			// Do nothing
		}
		expect(loadedIcon).toBe(false);

		// Test isPending
		expect(isPending({ provider, prefix, name: 'BadIconName' })).toBe(
			false
		);
	});

	it('Loading one icon twice with Promise', () => {
		return new Promise((fulfill, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				const item: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons,
				};

				// Test input and return as one item
				const expected: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons: ['icon1'],
				};
				expect(item).toEqual(expected);

				return [item];
			};

			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				expect(params.type).toBe('icons');

				// Test input
				expect(host).toBe('https://api1.local');
				const expected: IconifyAPIQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons: ['icon1'],
				};
				expect(params).toEqual(expected);

				// Send data
				callback('success', {
					prefix,
					icons: {
						icon1: {
							body: '<path d="" />',
						},
					},
				});
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icon, twice
			const p1 = loadIcon(provider + ':' + prefix + ':icon1');
			const p2 = loadIcon(provider + ':' + prefix + ':icon1');

			// Promise instances should be the same because parameter is a string that is cached
			expect(p1).toEqual(p2);

			// Test isPending
			expect(isPending({ provider, prefix, name: 'icon1' })).toBe(true);

			// Wait for Promise
			p1.then((data) => {
				expect(data.body).toEqual('<path d="" />');
				fulfill(true);
			}).catch((err) => {
				console.error(err);
				reject('Failed to load icon');
			});
		});
	});

	it('Split results', () => {
		return new Promise((fulfill) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				// Split all icons in multiple queries, one icon per query
				const results: IconifyAPIIconsQueryParams[] = [];
				icons.forEach((icon) => {
					const item: IconifyAPIIconsQueryParams = {
						type: 'icons',
						provider,
						prefix,
						icons: [icon],
					};
					results.push(item);
				});

				expect(results.length).toBe(2);

				return results;
			};

			let queryCounter = 0;
			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				// Test input
				expect(host).toBe('https://api1.local');

				expect(params.type).toBe('icons');
				if (params.type !== 'icons') {
					return;
				}

				// Icon names should match queryCounter: 'icon1' on first run, 'icon2' on second run
				queryCounter++;
				const expected: IconifyAPIQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons: ['icon' + queryCounter.toString()],
				};
				expect(params).toEqual(expected);

				// Send only requested icons
				const icons = Object.create(null) as Record<
					string,
					IconifyIcon
				>;
				params.icons.forEach((icon) => {
					icons[icon] = {
						body: '<path d="" />',
					};
				});
				callback('success', {
					prefix,
					icons,
					// Test mismatched provider: should be ignored because provider name is not affected by actual API response
					provider: nextPrefix(),
				});
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icons
			let callbackCalled = false;
			loadIcons(
				[
					provider + ':' + prefix + ':icon1',
					provider + ':' + prefix + ':icon2',
				],
				(loaded, missing, pending) => {
					// Callback should be called only once because results should be sent in same tick
					expect(callbackCalled).toBe(false);
					callbackCalled = true;

					// Test data
					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'icon1',
						},
						{
							provider,
							prefix,
							name: 'icon2',
						},
					]);
					expect(missing).toEqual([]);
					expect(pending).toEqual([]);
					fulfill(true);
				}
			);
		});
	});

	it('Fail on default host', () => {
		return new Promise((fulfill, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				const item: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons,
				};
				return [item];
			};

			let queryCounter = 0;
			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				queryCounter++;
				switch (queryCounter) {
					case 1:
						// First call on api1
						expect(host).toBe('https://api1.local');

						// Do nothing - fake failed response
						break;

					case 2:
						// First call on api2
						expect(host).toBe('https://api2.local');

						// Return result
						callback('success', {
							prefix,
							icons: {
								icon1: {
									body: '<path d="" />',
								},
								icon2: {
									body: '<path d="" />',
								},
							},
						});
						break;

					default:
						reject(
							`Unexpected additional call to sendQuery for host ${host}.`
						);
				}
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icons
			let callbackCalled = false;
			loadIcons(
				[
					provider + ':' + prefix + ':icon1',
					provider + ':' + prefix + ':icon2',
				],
				(loaded, missing, pending) => {
					// Callback should be called only once
					expect(callbackCalled).toBe(false);
					callbackCalled = true;

					// Test data
					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'icon1',
						},
						{
							provider,
							prefix,
							name: 'icon2',
						},
					]);
					expect(missing).toEqual([]);
					expect(pending).toEqual([]);

					fulfill(true);
				}
			);
		});
	});

	it('Fail on default host, multiple queries', () => {
		return new Promise((fulfill, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				const item: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons,
				};
				return [item];
			};

			let queryCounter = 0;
			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				queryCounter++;

				expect(params.type).toBe('icons');
				if (params.type !== 'icons') {
					return;
				}

				switch (queryCounter) {
					case 1:
						// First call on api1
						expect(params.icons).toEqual(['icon1', 'icon2']);
						expect(host).toBe('https://api1.local');

						// Do nothing - fake failed response
						break;

					case 2:
						// First call on api2
						expect(params.icons).toEqual(['icon1', 'icon2']);
						expect(host).toBe('https://api2.local');

						// Return result
						callback('success', {
							prefix,
							icons: {
								icon1: {
									body: '<path d="" />',
								},
								icon2: {
									body: '<path d="" />',
								},
							},
						});
						break;

					case 3:
						// Second call, should have api2 as default
						expect(params.icons).toEqual(['icon3', 'icon4']);
						expect(host).toBe('https://api2.local');

						// Return result
						callback('success', {
							prefix,
							icons: {
								icon3: {
									body: '<path d="" />',
								},
								icon4: {
									body: '<path d="" />',
								},
							},
						});
						break;

					default:
						reject(
							`Unexpected additional call to sendQuery for host ${host}.`
						);
				}
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icons
			let callbackCalled = false;
			loadIcons(
				[
					provider + ':' + prefix + ':icon1',
					provider + ':' + prefix + ':icon2',
				],
				(loaded, missing, pending) => {
					// Callback should be called only once
					expect(callbackCalled).toBe(false);
					callbackCalled = true;

					// Test data
					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'icon1',
						},
						{
							provider,
							prefix,
							name: 'icon2',
						},
					]);
					expect(missing).toEqual([]);
					expect(pending).toEqual([]);

					// Send another query on next tick
					setTimeout(() => {
						let callbackCalled = false;
						loadIcons(
							[
								provider + ':' + prefix + ':icon3',
								provider + ':' + prefix + ':icon4',
							],
							(loaded, missing, pending) => {
								// Callback should be called only once
								expect(callbackCalled).toBe(false);
								callbackCalled = true;

								// Test data
								expect(loaded).toEqual([
									{
										provider,
										prefix,
										name: 'icon3',
									},
									{
										provider,
										prefix,
										name: 'icon4',
									},
								]);
								expect(missing).toEqual([]);
								expect(pending).toEqual([]);

								fulfill(true);
							}
						);
					});
				}
			);
		});
	});

	it('Fail on default host, multiple queries with different prefixes', () => {
		return new Promise((fulfill, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();
			const prefix2 = nextPrefix();

			// Set config
			addAPIProvider(provider, {
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			});

			// Icon loader
			const prepareQuery = (
				provider: string,
				prefix: string,
				icons: string[]
			): IconifyAPIIconsQueryParams[] => {
				const item: IconifyAPIIconsQueryParams = {
					type: 'icons',
					provider,
					prefix,
					icons,
				};
				return [item];
			};

			let queryCounter = 0;
			const sendQuery = (
				host: string,
				params: IconifyAPIQueryParams,
				callback: QueryModuleResponse
			): void => {
				queryCounter++;

				expect(params.type).toBe('icons');
				if (params.type !== 'icons') {
					return;
				}

				switch (queryCounter) {
					case 1:
						// First call on api1
						expect(params.prefix).toBe(prefix);
						expect(params.icons).toEqual(['icon1', 'icon2']);
						expect(host).toBe('https://api1.local');

						// Do nothing - fake failed response
						break;

					case 2:
						// First call on api2
						expect(params.prefix).toBe(prefix);
						expect(params.icons).toEqual(['icon1', 'icon2']);
						expect(host).toBe('https://api2.local');

						// Return result
						callback('success', {
							prefix: params.prefix,
							icons: {
								icon1: {
									body: '<path d="" />',
								},
								icon2: {
									body: '<path d="" />',
								},
							},
						});
						break;

					case 3:
						// Second call, should have api2 as default
						expect(params.prefix).toBe(prefix2);
						expect(params.icons).toEqual(['icon2', 'icon4']);
						expect(host).toBe('https://api2.local');

						// Return result
						callback('success', {
							prefix: params.prefix,
							icons: {
								icon2: {
									body: '<path d="" />',
								},
								icon4: {
									body: '<path d="" />',
								},
							},
						});
						break;

					default:
						reject(
							`Unexpected additional call to sendQuery for host ${host}.`
						);
				}
			};

			setAPIModule(provider, {
				prepare: prepareQuery,
				send: sendQuery,
			});

			// Load icons
			let callbackCalled = false;
			loadIcons(
				[
					provider + ':' + prefix + ':icon1',
					provider + ':' + prefix + ':icon2',
				],
				(loaded, missing, pending) => {
					// Callback should be called only once
					expect(callbackCalled).toBe(false);
					callbackCalled = true;

					// Test data
					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'icon1',
						},
						{
							provider,
							prefix,
							name: 'icon2',
						},
					]);
					expect(missing).toEqual([]);
					expect(pending).toEqual([]);

					// Send another query on next tick for different prefix that shares configuration
					setTimeout(() => {
						let callbackCalled = false;
						loadIcons(
							[
								provider + ':' + prefix2 + ':icon2',
								provider + ':' + prefix2 + ':icon4',
							],
							(loaded, missing, pending) => {
								// Callback should be called only once
								expect(callbackCalled).toBe(false);
								callbackCalled = true;

								// Test data
								expect(loaded).toEqual([
									{
										provider,
										prefix: prefix2,
										name: 'icon2',
									},
									{
										provider,
										prefix: prefix2,
										name: 'icon4',
									},
								]);
								expect(missing).toEqual([]);
								expect(pending).toEqual([]);

								fulfill(true);
							}
						);
					});
				}
			);
		});
	});
});
