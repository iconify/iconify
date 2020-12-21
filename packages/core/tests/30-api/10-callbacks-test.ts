/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import {
	callbacks,
	updateCallbacks,
	storeCallback,
} from '../../lib/api/callbacks';
import { sortIcons } from '../../lib/icon/sort';
import { getStorage, addIconSet } from '../../lib/storage/storage';

describe('Testing API callbacks', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return 'api-cb-test-' + (prefixCounter < 10 ? '0' : '') + prefixCounter;
	}

	it('Simple callback', (done) => {
		const provider = 'iconify';
		const prefix = nextPrefix();
		let counter = 0;

		const storage = getStorage(provider, prefix);
		const abort = storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				expect(unsubscribe).to.be.equal(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).to.be.eql([
							{
								provider,
								prefix,
								name: 'icon1',
							},
						]);
						expect(missing).to.be.eql([
							{
								provider,
								prefix,
								name: 'icon3',
							},
						]);
						expect(pending).to.be.eql([
							{
								provider,
								prefix,
								name: 'icon2',
							},
						]);
						expect(callbacks[provider][prefix].length).to.be.equal(
							1
						);

						// Add icon2 and trigger update
						addIconSet(storage, {
							prefix: prefix,
							icons: {
								icon2: {
									body: '<g></g>',
								},
							},
						});

						updateCallbacks(provider, prefix);
						return;

					case 2:
						// Second run - icon2 should be added, completing callback
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
						expect(missing).to.be.eql([
							{
								provider,
								prefix,
								name: 'icon3',
							},
						]);
						expect(pending).to.be.eql([]);
						expect(callbacks[provider][prefix].length).to.be.equal(
							0
						);
						done();
				}
			},
			sortIcons([
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
				{
					provider,
					prefix,
					name: 'icon3',
				},
			]),
			[
				{
					provider,
					prefix,
				},
			]
		);

		// Test callbacks
		expect(callbacks[provider][prefix].length).to.be.equal(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).to.be.equal(0);

			// Add few icons and run updateCallbacks
			addIconSet(storage, {
				prefix: prefix,
				icons: {
					icon1: {
						body: '<g></g>',
					},
				},
				not_found: ['icon3'],
			});
			updateCallbacks(provider, prefix);
		});
	});

	it('Callback that should not be stored', () => {
		const provider = '';
		const prefix = nextPrefix();

		const storage = getStorage(provider, prefix);
		addIconSet(storage, {
			prefix,
			icons: {
				icon1: {
					body: '<path d="" />',
				},
				icon2: {
					body: '<path d="" />',
				},
			},
			not_found: ['icon3'],
		});

		storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				throw new Error('This code should not be executed!');
			},
			sortIcons([
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
				{
					provider,
					prefix,
					name: 'icon3',
				},
			]),
			[
				{
					provider,
					prefix,
				},
			]
		);

		// callbacks should not have been initialised
		expect(callbacks[prefix]).to.be.equal(void 0);
	});

	it('Cancel callback', (done) => {
		const provider = 'foo';
		const prefix = nextPrefix();
		let counter = 0;

		const storage = getStorage(provider, prefix);
		const abort = storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				expect(unsubscribe).to.be.equal(abort);

				counter++;
				expect(counter).to.be.equal(1);

				// First run - icon1 should be loaded, icon3 should be missing
				expect(loaded).to.be.eql([
					{
						provider,
						prefix,
						name: 'icon1',
					},
				]);
				expect(missing).to.be.eql([
					{
						provider,
						prefix,
						name: 'icon3',
					},
				]);
				expect(pending).to.be.eql([
					{
						provider,
						prefix,
						name: 'icon2',
					},
				]);
				expect(callbacks[provider][prefix].length).to.be.equal(1);

				// Add icon2 and trigger update
				addIconSet(storage, {
					prefix: prefix,
					icons: {
						icon2: {
							body: '<g></g>',
						},
					},
				});

				updateCallbacks(provider, prefix);

				// Unsubscribe and set timer to call done()
				unsubscribe();
				expect(callbacks[provider][prefix].length).to.be.equal(0);
				setTimeout(done);
			},
			sortIcons([
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
				{
					provider,
					prefix,
					name: 'icon3',
				},
			]),
			[
				{
					provider,
					prefix,
				},
			]
		);

		// Test callbacks
		expect(callbacks[provider][prefix].length).to.be.equal(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).to.be.equal(0);

			// Add few icons and run updateCallbacks
			addIconSet(storage, {
				prefix: prefix,
				icons: {
					icon1: {
						body: '<g></g>',
					},
				},
				not_found: ['icon3'],
			});
			updateCallbacks(provider, prefix);
		});
	});

	it('Multiple prefixes', (done) => {
		const provider = '';
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();
		let counter = 0;

		const storage1 = getStorage(provider, prefix1);
		const storage2 = getStorage(provider, prefix2);

		const abort = storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				expect(unsubscribe).to.be.equal(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).to.be.eql([
							{
								provider,
								prefix: prefix1,
								name: 'icon1',
							},
						]);
						expect(missing).to.be.eql([
							{
								provider,
								prefix: prefix1,
								name: 'icon3',
							},
						]);
						expect(pending).to.be.eql([
							{
								provider,
								prefix: prefix2,
								name: 'icon2',
							},
						]);
						expect(callbacks[provider][prefix1].length).to.be.equal(
							0
						);
						expect(callbacks[provider][prefix2].length).to.be.equal(
							1
						);

						// Add icon2 and trigger update
						addIconSet(storage2, {
							prefix: prefix2,
							icons: {
								icon2: {
									body: '<g></g>',
								},
							},
						});

						updateCallbacks(provider, prefix2);
						break;

					case 2:
						// Second run - icon2 should be loaded
						expect(callbacks[provider][prefix1].length).to.be.equal(
							0
						);
						expect(callbacks[provider][prefix2].length).to.be.equal(
							0
						);
						done();
						break;

					default:
						done('Callback was called ' + counter + ' times.');
				}
			},
			sortIcons([
				{
					provider,
					prefix: prefix1,
					name: 'icon1',
				},
				{
					provider,
					prefix: prefix2,
					name: 'icon2',
				},
				{
					provider,
					prefix: prefix1,
					name: 'icon3',
				},
			]),
			[
				{ provider, prefix: prefix1 },
				{ provider, prefix: prefix2 },
			]
		);

		// Test callbacks
		expect(callbacks[provider][prefix1].length).to.be.equal(1);
		expect(callbacks[provider][prefix2].length).to.be.equal(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix1);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).to.be.equal(0);

			// Add few icons and run updateCallbacks
			addIconSet(storage1, {
				prefix: prefix1,
				icons: {
					icon1: {
						body: '<g></g>',
					},
				},
				not_found: ['icon3'],
			});
			updateCallbacks(provider, prefix1);
		});
	});

	it('Multiple providers', (done) => {
		const provider1 = nextPrefix();
		const provider2 = nextPrefix();
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();
		let counter = 0;

		const storage1 = getStorage(provider1, prefix1);
		const storage2 = getStorage(provider2, prefix2);

		const abort = storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				expect(unsubscribe).to.be.equal(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).to.be.eql([
							{
								provider: provider1,
								prefix: prefix1,
								name: 'icon1',
							},
						]);
						expect(missing).to.be.eql([
							{
								provider: provider1,
								prefix: prefix1,
								name: 'icon3',
							},
						]);
						expect(pending).to.be.eql([
							{
								provider: provider2,
								prefix: prefix2,
								name: 'icon2',
							},
						]);
						expect(
							callbacks[provider1][prefix1].length
						).to.be.equal(0);
						expect(
							callbacks[provider2][prefix2].length
						).to.be.equal(1);

						// Make sure providers/prefixes aren't mixed
						expect(callbacks[provider1][prefix2]).to.be.equal(
							void 0
						);
						expect(callbacks[provider2][prefix1]).to.be.equal(
							void 0
						);

						// Add icon2 and trigger update
						addIconSet(storage2, {
							prefix: prefix2,
							icons: {
								icon2: {
									body: '<g></g>',
								},
							},
						});

						updateCallbacks(provider2, prefix2);
						break;

					case 2:
						// Second run - icon2 should be loaded
						expect(
							callbacks[provider1][prefix1].length
						).to.be.equal(0);
						expect(
							callbacks[provider2][prefix2].length
						).to.be.equal(0);

						// Make sure providers/prefixes aren't mixed
						expect(callbacks[provider1][prefix2]).to.be.equal(
							void 0
						);
						expect(callbacks[provider2][prefix1]).to.be.equal(
							void 0
						);

						done();
						break;

					default:
						done('Callback was called ' + counter + ' times.');
				}
			},
			sortIcons([
				{
					provider: provider1,
					prefix: prefix1,
					name: 'icon1',
				},
				{
					provider: provider2,
					prefix: prefix2,
					name: 'icon2',
				},
				{
					provider: provider1,
					prefix: prefix1,
					name: 'icon3',
				},
			]),
			[
				{ provider: provider1, prefix: prefix1 },
				{ provider: provider2, prefix: prefix2 },
			]
		);

		// Test callbacks
		expect(callbacks[provider1][prefix1].length).to.be.equal(1);
		expect(callbacks[provider2][prefix2].length).to.be.equal(1);

		expect(callbacks[provider1][prefix2]).to.be.equal(void 0);
		expect(callbacks[provider2][prefix1]).to.be.equal(void 0);

		// Test update - should do nothing
		updateCallbacks(provider1, prefix1);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).to.be.equal(0);

			// Add few icons and run updateCallbacks
			addIconSet(storage1, {
				prefix: prefix1,
				icons: {
					icon1: {
						body: '<g></g>',
					},
				},
				not_found: ['icon3'],
			});
			updateCallbacks(provider1, prefix1);
		});
	});
});
