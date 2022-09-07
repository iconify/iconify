import { updateCallbacks, storeCallback } from '../../lib/api/callbacks';
import type { IconStorageWithAPI } from '../../lib/api/types';
import { sortIcons } from '../../lib/icon/sort';
import { getStorage, addIconSet } from '../../lib/storage/storage';

describe('Testing API callbacks', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-cb-test-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
		);
	}

	it('Simple callback', () => {
		return new Promise((fulfill) => {
			const provider = 'iconify';
			const prefix = nextPrefix();
			let counter = 0;

			const storage = getStorage(provider, prefix) as IconStorageWithAPI;
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
							expect(storage.loaderCallbacks?.length).toBe(1);

							// Add icon2 and trigger update
							addIconSet(storage, {
								prefix: prefix,
								icons: {
									icon2: {
										body: '<g></g>',
									},
								},
							});

							updateCallbacks(storage);
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
							expect(storage.loaderCallbacks?.length).toBe(0);
							fulfill(true);
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
				[storage]
			);

			// Test callbacks
			expect(storage.loaderCallbacks?.length).toBe(1);

			// Test update - should do nothing
			updateCallbacks(storage);

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
				updateCallbacks(storage);
			});
		});
	});

	it('Callback that should not be stored', () => {
		const provider = '';
		const prefix = nextPrefix();

		const storage = getStorage(provider, prefix) as IconStorageWithAPI;
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
			[storage]
		);

		// callbacks should not have been initialised
		expect(storage.loaderCallbacks).toBeUndefined();
	});

	it('Cancel callback', () => {
		return new Promise((fulfill) => {
			const provider = 'foo';
			const prefix = nextPrefix();
			let counter = 0;

			const storage = getStorage(provider, prefix) as IconStorageWithAPI;
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
					expect(storage.loaderCallbacks?.length).toBe(1);

					// Add icon2 and trigger update
					addIconSet(storage, {
						prefix: prefix,
						icons: {
							icon2: {
								body: '<g></g>',
							},
						},
					});

					updateCallbacks(storage);

					// Unsubscribe and set timer to complete test
					unsubscribe();
					expect(storage.loaderCallbacks?.length).toBe(0);
					setTimeout(fulfill);
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
				[storage]
			);

			// Test callbacks
			expect(storage.loaderCallbacks?.length).toBe(1);

			// Test update - should do nothing
			updateCallbacks(storage);

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
				updateCallbacks(storage);
			});
		});
	});

	it('Multiple prefixes', () => {
		return new Promise((fulfill, reject) => {
			const provider = '';
			const prefix1 = nextPrefix();
			const prefix2 = nextPrefix();
			let counter = 0;

			const storage1 = getStorage(
				provider,
				prefix1
			) as IconStorageWithAPI;
			const storage2 = getStorage(
				provider,
				prefix2
			) as IconStorageWithAPI;

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
							expect(storage1.loaderCallbacks?.length).toBe(0);
							expect(storage2.loaderCallbacks?.length).toBe(1);

							// Add icon2 and trigger update
							addIconSet(storage2, {
								prefix: prefix2,
								icons: {
									icon2: {
										body: '<g></g>',
									},
								},
							});

							updateCallbacks(storage2);
							break;

						case 2:
							// Second run - icon2 should be loaded
							expect(storage1.loaderCallbacks?.length).toBe(0);
							expect(storage2.loaderCallbacks?.length).toBe(0);
							fulfill(true);
							break;

						default:
							reject(`Callback was called ${counter} times.`);
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
				[storage1, storage2]
			);

			// Test callbacks
			expect(storage1.loaderCallbacks?.length).toBe(1);
			expect(storage2.loaderCallbacks?.length).toBe(1);

			// Test update - should do nothing
			updateCallbacks(storage1);

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
				updateCallbacks(storage1);
			});
		});
	});

	it('Multiple providers', () => {
		return new Promise((fulfill, reject) => {
			const provider1 = nextPrefix();
			const provider2 = nextPrefix();
			const prefix1 = nextPrefix();
			const prefix2 = nextPrefix();
			let counter = 0;

			const storage1 = getStorage(
				provider1,
				prefix1
			) as IconStorageWithAPI;
			const storage2 = getStorage(
				provider2,
				prefix2
			) as IconStorageWithAPI;

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
							expect(storage1.loaderCallbacks?.length).toBe(0);
							expect(storage2.loaderCallbacks?.length).toBe(1);

							// Add icon2 and trigger update
							addIconSet(storage2, {
								prefix: prefix2,
								icons: {
									icon2: {
										body: '<g></g>',
									},
								},
							});

							updateCallbacks(storage2);
							break;

						case 2:
							// Second run - icon2 should be loaded
							expect(storage1.loaderCallbacks?.length).toBe(0);
							expect(storage2.loaderCallbacks?.length).toBe(0);

							fulfill(true);
							break;

						default:
							reject(`Callback was called ${counter} times.`);
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
				[storage1, storage2]
			);

			// Test callbacks
			expect(storage1.loaderCallbacks?.length).toBe(1);
			expect(storage2.loaderCallbacks?.length).toBe(1);

			// Test update - should do nothing
			updateCallbacks(storage1);

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
				updateCallbacks(storage1);
			});
		});
	});
});
