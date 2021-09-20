/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import type { PendingQueryItem } from '@iconify/api-redundancy';
import { setAPIConfig } from '../../lib/api/config';
import type {
	IconifyAPIIconsQueryParams,
	IconifyAPIQueryParams,
} from '../../lib/api/modules';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons, isPending } from '../../lib/api/icons';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
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
		setAPIConfig(provider, {
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
			expect(asyncCounter).to.be.equal(1);
			asyncCounter++;

			// Test input and return as one item
			const expected: IconifyAPIIconsQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon1', 'icon2'],
			};
			expect(item).to.be.eql(expected);

			return [item];
		};

		const sendQuery = (
			host: string,
			params: IconifyAPIQueryParams,
			item: PendingQueryItem
		): void => {
			// This callback should be called after prepareQuery
			expect(asyncCounter).to.be.equal(2);
			asyncCounter++;

			expect(params.type).to.be.equal('icons');

			// Test input
			expect(host).to.be.equal('https://api1.local');
			const expected: IconifyAPIQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon1', 'icon2'],
			};
			expect(params).to.be.eql(expected);

			// Send data
			item.done({
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
			expect(asyncCounter).to.be.equal(3);
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
			(loaded, missing, pending, unsubscribe) => {
				// This callback should be called last
				expect(asyncCounter).to.be.equal(3);
				asyncCounter++;

				expect(loaded).to.be.eql([
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
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				expect(
					isPending({
						provider,
						prefix,
						name: 'icon1',
					})
				).to.be.equal(false);
				expect(
					isPending({ provider, prefix, name: 'icon3' })
				).to.be.equal(false);

				done();
			}
		);

		// Test isPending
		expect(isPending({ provider, prefix, name: 'icon1' })).to.be.equal(
			true
		);
		expect(isPending({ provider, prefix, name: 'icon3' })).to.be.equal(
			false
		);

		// Make sure asyncCounter wasn't increased because loading shoud happen on next tick
		expect(asyncCounter).to.be.equal(0);
		asyncCounter++;
	});

	it('Split results', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(provider, {
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

			expect(results.length).to.be.equal(2);

			return results;
		};

		let queryCounter = 0;
		const sendQuery = (
			host: string,
			params: IconifyAPIQueryParams,
			item: PendingQueryItem
		): void => {
			// Test input
			expect(host).to.be.equal('https://api1.local');

			expect(params.type).to.be.equal('icons');
			if (params.type !== 'icons') {
				return;
			}

			// Icon names should match queryCounter: 'icon1' on first run, 'icon2' on second run
			queryCounter++;
			const expected: IconifyAPIQueryParams = {
				type: 'icons',
				provider,
				prefix,
				icons: ['icon' + queryCounter],
			};
			expect(params).to.be.eql(expected);

			// Send only requested icons
			const icons = Object.create(null);
			params.icons.forEach((icon) => {
				icons[icon] = {
					body: '<path d="" />',
				};
			});
			item.done({
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
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once because results should be sent in same tick
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
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
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);
				done();
			}
		);
	});

	it('Fail on default host', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(provider, {
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
			item: PendingQueryItem
		): void => {
			queryCounter++;
			switch (queryCounter) {
				case 1:
					// First call on api1
					expect(host).to.be.equal('https://api1.local');

					// Do nothing - fake failed response
					break;

				case 2:
					// First call on api2
					expect(host).to.be.equal('https://api2.local');

					// Return result
					item.done({
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
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
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
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				done();
			}
		);
	});

	it('Fail on default host, multiple queries', (done) => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(provider, {
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
			item: PendingQueryItem
		): void => {
			queryCounter++;

			expect(params.type).to.be.equal('icons');
			if (params.type !== 'icons') {
				return;
			}

			switch (queryCounter) {
				case 1:
					// First call on api1
					expect(params.icons).to.be.eql(['icon1', 'icon2']);
					expect(host).to.be.equal('https://api1.local');

					// Do nothing - fake failed response
					break;

				case 2:
					// First call on api2
					expect(params.icons).to.be.eql(['icon1', 'icon2']);
					expect(host).to.be.equal('https://api2.local');

					// Return result
					item.done({
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
					expect(params.icons).to.be.eql(['icon3', 'icon4']);
					expect(host).to.be.equal('https://api2.local');

					// Return result
					item.done({
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
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
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
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				// Send another query on next tick
				setTimeout(() => {
					let callbackCalled = false;
					loadIcons(
						[
							provider + ':' + prefix + ':icon3',
							provider + ':' + prefix + ':icon4',
						],
						(loaded, missing, pending, unsubscribe) => {
							// Callback should be called only once
							expect(callbackCalled).to.be.equal(false);
							callbackCalled = true;

							// Test data
							expect(loaded).to.be.eql([
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
							expect(missing).to.be.eql([]);
							expect(pending).to.be.eql([]);

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
		setAPIConfig(provider, {
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
			item: PendingQueryItem
		): void => {
			queryCounter++;

			expect(params.type).to.be.equal('icons');
			if (params.type !== 'icons') {
				return;
			}

			switch (queryCounter) {
				case 1:
					// First call on api1
					expect(params.prefix).to.be.equal(prefix);
					expect(params.icons).to.be.eql(['icon1', 'icon2']);
					expect(host).to.be.equal('https://api1.local');

					// Do nothing - fake failed response
					break;

				case 2:
					// First call on api2
					expect(params.prefix).to.be.equal(prefix);
					expect(params.icons).to.be.eql(['icon1', 'icon2']);
					expect(host).to.be.equal('https://api2.local');

					// Return result
					item.done({
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
					expect(params.prefix).to.be.equal(prefix2);
					expect(params.icons).to.be.eql(['icon2', 'icon4']);
					expect(host).to.be.equal('https://api2.local');

					// Return result
					item.done({
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
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
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
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				// Send another query on next tick for different prefix that shares configuration
				setTimeout(() => {
					let callbackCalled = false;
					loadIcons(
						[
							provider + ':' + prefix2 + ':icon2',
							provider + ':' + prefix2 + ':icon4',
						],
						(loaded, missing, pending, unsubscribe) => {
							// Callback should be called only once
							expect(callbackCalled).to.be.equal(false);
							callbackCalled = true;

							// Test data
							expect(loaded).to.be.eql([
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
							expect(missing).to.be.eql([]);
							expect(pending).to.be.eql([]);

							done();
						}
					);
				});
			}
		);
	});
});
