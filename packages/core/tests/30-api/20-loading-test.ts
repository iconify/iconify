/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import { RedundancyPendingItem } from '@cyberalien/redundancy';
import { setAPIConfig } from '../../lib/api/config';
import { setAPIModule, APIQueryParams } from '../../lib/api/modules';
import { API } from '../../lib/api/';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-load-test-' + (prefixCounter < 10 ? '0' : '') + prefixCounter
		);
	}

	it('Loading few icons', done => {
		const prefix = nextPrefix();
		let asyncCounter = 0;

		// Set config
		setAPIConfig(
			{
				resources: ['https://api1.local', 'https://api2.local'],
			},
			prefix
		);

		// Icon loader
		const prepareQuery = (
			prefix: string,
			icons: string[]
		): APIQueryParams[] => {
			const item: APIQueryParams = {
				prefix,
				icons,
			};

			// This callback should be called first
			expect(asyncCounter).to.be.equal(1);
			asyncCounter++;

			// Test input and return as one item
			const expected: APIQueryParams = {
				prefix,
				icons: ['icon1', 'icon2'],
			};
			expect(item).to.be.eql(expected);

			return [item];
		};

		const sendQuery = (
			host: string,
			params: APIQueryParams,
			status: RedundancyPendingItem
		): void => {
			// This callback should be called after prepareQuery
			expect(asyncCounter).to.be.equal(2);
			asyncCounter++;

			// Test input
			expect(host).to.be.equal('https://api1.local');
			const expected: APIQueryParams = {
				prefix,
				icons: ['icon1', 'icon2'],
			};
			expect(params).to.be.eql(expected);

			// Send data
			status.done({
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

		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			prefix
		);

		// Load icons
		API.loadIcons(
			[
				// as icon
				{
					prefix,
					name: 'icon1',
				},
				// as string
				prefix + ':icon2',
			],
			(loaded, missing, pending, unsubscribe) => {
				// This callback should be called last
				expect(asyncCounter).to.be.equal(3);
				asyncCounter++;

				expect(loaded).to.be.eql([
					{
						prefix,
						name: 'icon1',
					},
					{
						prefix,
						name: 'icon2',
					},
				]);
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				expect(API.isPending(prefix, 'icon1')).to.be.equal(false);
				expect(API.isPending(prefix, 'icon3')).to.be.equal(false);

				done();
			}
		);

		// Test isPending
		expect(API.isPending(prefix, 'icon1')).to.be.equal(true);
		expect(API.isPending(prefix, 'icon3')).to.be.equal(false);

		// Make sure asyncCounter wasn't increased because loading shoud happen on next tick
		expect(asyncCounter).to.be.equal(0);
		asyncCounter++;
	});

	it('Split results', done => {
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(
			{
				resources: ['https://api1.local', 'https://api2.local'],
			},
			prefix
		);

		// Icon loader
		const prepareQuery = (
			prefix: string,
			icons: string[]
		): APIQueryParams[] => {
			// Split all icons in multiple queries, one icon per query
			const results: APIQueryParams[] = [];
			icons.forEach(icon => {
				const item: APIQueryParams = {
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
			params: APIQueryParams,
			status: RedundancyPendingItem
		): void => {
			// Test input
			expect(host).to.be.equal('https://api1.local');

			// Icon names should match queryCounter: 'icon1' on first run, 'icon2' on second run
			queryCounter++;
			const expected: APIQueryParams = {
				prefix,
				icons: ['icon' + queryCounter],
			};
			expect(params).to.be.eql(expected);

			// Send only requested icons
			const icons = Object.create(null);
			params.icons.forEach(icon => {
				icons[icon] = {
					body: '<path d="" />',
				};
			});
			status.done({
				prefix,
				icons,
			});
		};

		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			prefix
		);

		// Load icons
		let callbackCalled = false;
		API.loadIcons(
			[prefix + ':icon1', prefix + ':icon2'],
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once because results should be sent in same tick
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
					{
						prefix,
						name: 'icon1',
					},
					{
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

	it('Fail on default host', done => {
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(
			{
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			},
			prefix
		);

		// Icon loader
		const prepareQuery = (
			prefix: string,
			icons: string[]
		): APIQueryParams[] => {
			const item: APIQueryParams = {
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (
			host: string,
			params: APIQueryParams,
			status: RedundancyPendingItem
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
					status.done({
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

		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			prefix
		);

		// Load icons
		let callbackCalled = false;
		API.loadIcons(
			[prefix + ':icon1', prefix + ':icon2'],
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
					{
						prefix,
						name: 'icon1',
					},
					{
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

	it('Fail on default host, multiple queries', done => {
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(
			{
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			},
			prefix
		);

		// Icon loader
		const prepareQuery = (
			prefix: string,
			icons: string[]
		): APIQueryParams[] => {
			const item: APIQueryParams = {
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (
			host: string,
			params: APIQueryParams,
			status: RedundancyPendingItem
		): void => {
			queryCounter++;
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
					status.done({
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
					status.done({
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

		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			prefix
		);

		// Load icons
		let callbackCalled = false;
		API.loadIcons(
			[prefix + ':icon1', prefix + ':icon2'],
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
					{
						prefix,
						name: 'icon1',
					},
					{
						prefix,
						name: 'icon2',
					},
				]);
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				// Send another query on next tick
				setTimeout(() => {
					let callbackCalled = false;
					API.loadIcons(
						[prefix + ':icon3', prefix + ':icon4'],
						(loaded, missing, pending, unsubscribe) => {
							// Callback should be called only once
							expect(callbackCalled).to.be.equal(false);
							callbackCalled = true;

							// Test data
							expect(loaded).to.be.eql([
								{
									prefix,
									name: 'icon3',
								},
								{
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

	it('Fail on default host, multiple queries with different prefixes', done => {
		const prefix = nextPrefix();
		const prefix2 = nextPrefix();

		// Set config
		setAPIConfig(
			{
				resources: ['https://api1.local', 'https://api2.local'],
				rotate: 100, // 100ms to speed up test
			},
			[prefix, prefix2]
		);

		// Icon loader
		const prepareQuery = (
			prefix: string,
			icons: string[]
		): APIQueryParams[] => {
			const item: APIQueryParams = {
				prefix,
				icons,
			};
			return [item];
		};

		let queryCounter = 0;
		const sendQuery = (
			host: string,
			params: APIQueryParams,
			status: RedundancyPendingItem
		): void => {
			queryCounter++;
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
					status.done({
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
					status.done({
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

		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			[prefix, prefix2]
		);

		// Load icons
		let callbackCalled = false;
		API.loadIcons(
			[prefix + ':icon1', prefix + ':icon2'],
			(loaded, missing, pending, unsubscribe) => {
				// Callback should be called only once
				expect(callbackCalled).to.be.equal(false);
				callbackCalled = true;

				// Test data
				expect(loaded).to.be.eql([
					{
						prefix,
						name: 'icon1',
					},
					{
						prefix,
						name: 'icon2',
					},
				]);
				expect(missing).to.be.eql([]);
				expect(pending).to.be.eql([]);

				// Send another query on next tick for different prefix that shares configuration
				setTimeout(() => {
					let callbackCalled = false;
					API.loadIcons(
						[prefix2 + ':icon2', prefix2 + ':icon4'],
						(loaded, missing, pending, unsubscribe) => {
							// Callback should be called only once
							expect(callbackCalled).to.be.equal(false);
							callbackCalled = true;

							// Test data
							expect(loaded).to.be.eql([
								{
									prefix: prefix2,
									name: 'icon2',
								},
								{
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
