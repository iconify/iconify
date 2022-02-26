import { addAPIProvider } from '@iconify/core/lib/api/config';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import { loadIcons, isPending } from '@iconify/core/lib/api/icons';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix() {
		prefixCounter++;
		return (
			'api-load-test-' + (prefixCounter < 10 ? '0' : '') + prefixCounter
		);
	}

	it('Loading few icons', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();
		let asyncCounter = 0;

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Icon loader
		const prepareQuery = (provider, prefix, icons) => {
			const item = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};

			// This callback should be called first
			expect(asyncCounter).toBe(1);
			asyncCounter++;

			// Test input and return as one item
			const expected = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon1', 'icon2'],
			};
			expect(item).toEqual(expected);

			return [item];
		};

		const sendQuery = (host, params, callback) => {
			// This callback should be called after prepareQuery
			expect(asyncCounter).toBe(2);
			asyncCounter++;

			expect(params.type).toBe('icons');

			// Test input
			expect(host).toBe('https://api1.local');
			const expected = {
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

				done();
			}
		);

		// Test isPending
		expect(isPending({ provider, prefix, name: 'icon1' })).toBe(true);
		expect(isPending({ provider, prefix, name: 'icon3' })).toBe(false);

		// Make sure asyncCounter wasn't increased because loading shoud happen on next tick
		expect(asyncCounter).toBe(0);
		asyncCounter++;
	});

	it('Split results', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Icon loader
		const prepareQuery = (provider, prefix, icons) => {
			// Split all icons in multiple queries, one icon per query
			const results = [];
			icons.forEach((icon) => {
				const item = {
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
		const sendQuery = (host, params, callback) => {
			// Test input
			expect(host).toBe('https://api1.local');

			expect(params.type).toBe('icons');
			if (params.type !== 'icons') {
				return;
			}

			// Icon names should match queryCounter: 'icon1' on first run, 'icon2' on second run
			queryCounter++;
			const expected = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon' + queryCounter],
			};
			expect(params).toEqual(expected);

			// Send only requested icons
			const icons = Object.create(null);
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
				done();
			}
		);
	});

	it('Fail on default host', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
			rotate: 100, // 100ms to speed up test
		});

		// Icon loader
		const prepareQuery = (provider, prefix, icons) => {
			const item = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (host, params, callback) => {
			queryCounter++;
			params;
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
					done(
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

				done();
			}
		);
	});

	it('Fail on default host, multiple queries', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
			rotate: 100, // 100ms to speed up test
		});

		// Icon loader
		const prepareQuery = (provider, prefix, icons) => {
			const item = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (host, params, callback) => {
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
					done(
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

							done();
						}
					);
				});
			}
		);
	});

	it('Fail on default host, multiple queries with different prefixes', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();
		const prefix2 = nextPrefix();

		// Set config
		addAPIProvider(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
			rotate: 100, // 100ms to speed up test
		});

		// Icon loader
		const prepareQuery = (provider, prefix, icons) => {
			const item = {
				type: 'icons',
				provider,
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (host, params, callback) => {
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
					done(
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

							done();
						}
					);
				});
			}
		);
	});
});
