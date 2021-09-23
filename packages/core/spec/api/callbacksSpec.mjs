import {
	callbacks,
	updateCallbacks,
	storeCallback,
} from '@iconify/core/lib/api/callbacks';
import { sortIcons } from '@iconify/core/lib/icon/sort';
import { getStorage, addIconSet } from '@iconify/core/lib/storage/storage';

describe('Testing API callbacks', () => {
	let prefixCounter = 0;
	function nextPrefix() {
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
				expect(unsubscribe).toBe(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).toEqual([
							{
								provider,
								prefix,
								name: 'icon1',
							},
						]);
						expect(missing).toEqual([
							{
								provider,
								prefix,
								name: 'icon3',
							},
						]);
						expect(pending).toEqual([
							{
								provider,
								prefix,
								name: 'icon2',
							},
						]);
						expect(callbacks[provider][prefix].length).toBe(1);

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
						expect(missing).toEqual([
							{
								provider,
								prefix,
								name: 'icon3',
							},
						]);
						expect(pending).toEqual([]);
						expect(callbacks[provider][prefix].length).toBe(0);
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
		expect(callbacks[provider][prefix].length).toBe(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).toBe(0);

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
			() => {
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
		expect(callbacks[prefix]).toBeUndefined();
	});

	it('Cancel callback', (done) => {
		const provider = 'foo';
		const prefix = nextPrefix();
		let counter = 0;

		const storage = getStorage(provider, prefix);
		const abort = storeCallback(
			(loaded, missing, pending, unsubscribe) => {
				expect(unsubscribe).toBe(abort);

				counter++;
				expect(counter).toBe(1);

				// First run - icon1 should be loaded, icon3 should be missing
				expect(loaded).toEqual([
					{
						provider,
						prefix,
						name: 'icon1',
					},
				]);
				expect(missing).toEqual([
					{
						provider,
						prefix,
						name: 'icon3',
					},
				]);
				expect(pending).toEqual([
					{
						provider,
						prefix,
						name: 'icon2',
					},
				]);
				expect(callbacks[provider][prefix].length).toBe(1);

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
				expect(callbacks[provider][prefix].length).toBe(0);
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
		expect(callbacks[provider][prefix].length).toBe(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).toBe(0);

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
				expect(unsubscribe).toBe(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).toEqual([
							{
								provider,
								prefix: prefix1,
								name: 'icon1',
							},
						]);
						expect(missing).toEqual([
							{
								provider,
								prefix: prefix1,
								name: 'icon3',
							},
						]);
						expect(pending).toEqual([
							{
								provider,
								prefix: prefix2,
								name: 'icon2',
							},
						]);
						expect(callbacks[provider][prefix1].length).toBe(0);
						expect(callbacks[provider][prefix2].length).toBe(1);

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
						expect(callbacks[provider][prefix1].length).toBe(0);
						expect(callbacks[provider][prefix2].length).toBe(0);
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
		expect(callbacks[provider][prefix1].length).toBe(1);
		expect(callbacks[provider][prefix2].length).toBe(1);

		// Test update - should do nothing
		updateCallbacks(provider, prefix1);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).toBe(0);

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
				expect(unsubscribe).toBe(abort);

				counter++;
				switch (counter) {
					case 1:
						// First run - icon1 should be loaded, icon3 should be missing
						expect(loaded).toEqual([
							{
								provider: provider1,
								prefix: prefix1,
								name: 'icon1',
							},
						]);
						expect(missing).toEqual([
							{
								provider: provider1,
								prefix: prefix1,
								name: 'icon3',
							},
						]);
						expect(pending).toEqual([
							{
								provider: provider2,
								prefix: prefix2,
								name: 'icon2',
							},
						]);
						expect(callbacks[provider1][prefix1].length).toBe(0);
						expect(callbacks[provider2][prefix2].length).toBe(1);

						// Make sure providers/prefixes aren't mixed
						expect(callbacks[provider1][prefix2]).toBeUndefined();
						expect(callbacks[provider2][prefix1]).toBeUndefined();

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
						expect(callbacks[provider1][prefix1].length).toBe(0);
						expect(callbacks[provider2][prefix2].length).toBe(0);

						// Make sure providers/prefixes aren't mixed
						expect(callbacks[provider1][prefix2]).toBeUndefined();
						expect(callbacks[provider2][prefix1]).toBeUndefined();

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
		expect(callbacks[provider1][prefix1].length).toBe(1);
		expect(callbacks[provider2][prefix2].length).toBe(1);

		expect(callbacks[provider1][prefix2]).toBeUndefined();
		expect(callbacks[provider2][prefix1]).toBeUndefined();

		// Test update - should do nothing
		updateCallbacks(provider1, prefix1);

		// Wait for tick because updateCallbacks will use one
		setTimeout(() => {
			// Callback should not have been called yet
			expect(counter).toBe(0);

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
