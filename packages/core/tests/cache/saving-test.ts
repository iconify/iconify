import type { IconifyJSON } from '@iconify/types';
import type {
	BrowserStorageItem,
	IconStorageWithCache,
} from '../../lib/browser-storage/types';
import { storeInBrowserStorage } from '../../lib/browser-storage/store';
import { initBrowserStorage } from '../../lib/browser-storage';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
} from '../../lib/browser-storage/data';
import { getBrowserStorageItemsCount } from '../../lib/browser-storage/count';
import { getBrowserStorage } from '../../lib/browser-storage/global';
import { getStorage, iconExists } from '../../lib/storage/storage';
import { nextPrefix, createCache, reset } from '../../lib/browser-storage/mock';
import {
	browserCacheCountKey,
	browserCachePrefix,
	browserCacheVersion,
	browserCacheVersionKey,
	browserStorageHour,
	browserStorageCacheExpiration,
} from '../../lib/browser-storage/config';

describe('Testing saving to localStorage', () => {
	const provider = '';

	it('One icon set', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix) as IconStorageWithCache;

		// Add one icon set
		const icon: IconifyJSON = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon,
		};

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		expect(iconExists(storage, 'foo')).toBe(false);
		expect(storage.lastModifiedCached).toBeUndefined();

		// Counter should be 0
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);

		// Save item
		storeInBrowserStorage(storage, icon);

		// Storing in cache should not add item to storage
		expect(iconExists(storage, 'foo')).toBe(false);

		// lastModified is missing, so should not have updated
		expect(storage.lastModifiedCached).toBeUndefined();

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item)
		);
		expect(cache.getItem(browserCacheCountKey)).toBe('1');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			1
		);
	});

	it('Multiple icon sets', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix) as IconStorageWithCache;
		const lastModified = 12345;

		// Add icon sets
		const icon0: IconifyJSON = {
			prefix: prefix,
			lastModified,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon0,
		};
		const icon1: IconifyJSON = {
			prefix: prefix,
			lastModified,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item1: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon1,
		};

		// Set cache
		reset({
			localStorage: cache,
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);
		expect(storage.lastModifiedCached).toBeUndefined();

		// Save items
		storeInBrowserStorage(storage, icon0);
		storeInBrowserStorage(storage, icon1);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// lastModified should be set
		expect(storage.lastModifiedCached).toBe(lastModified);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			2
		);

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item0)
		);
		expect(cache.getItem(browserCachePrefix + '1')).toBe(
			JSON.stringify(item1)
		);
		expect(cache.getItem(browserCacheCountKey)).toBe('2');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Multiple icon sets, first is outdated', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix) as IconStorageWithCache;
		const lastModified1 = 1234;
		const lastModified2 = 12345;

		// Add icon sets
		const icon0: IconifyJSON = {
			prefix: prefix,
			lastModified: lastModified1,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon0,
		};

		// lastModified is newer than first entry: first entry should be deleted
		const icon1: IconifyJSON = {
			prefix: prefix,
			lastModified: lastModified2,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item1: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon1,
		};

		// Set cache
		reset({
			localStorage: cache,
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);
		expect(storage.lastModifiedCached).toBeUndefined();

		// Save items
		storeInBrowserStorage(storage, icon0);
		storeInBrowserStorage(storage, icon1);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// lastModified should be set to max value
		expect(storage.lastModifiedCached).toBe(lastModified2);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			1
		);

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			// Second item!
			JSON.stringify(item1)
		);
		expect(cache.getItem(browserCachePrefix + '1')).toBeFalsy();
		expect(cache.getItem(browserCacheCountKey)).toBe('1');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Multiple icon sets, second set is outdated', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix) as IconStorageWithCache;
		const lastModified1 = 12345;
		const lastModified2 = 1234;

		// Add icon sets
		const icon0: IconifyJSON = {
			prefix: prefix,
			lastModified: lastModified1,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon0,
		};

		// Icon set with lastModified lower than previous entry should not be stored
		const icon1: IconifyJSON = {
			prefix: prefix,
			lastModified: lastModified2,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};

		// Set cache
		reset({
			localStorage: cache,
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);
		expect(storage.lastModifiedCached).toBeUndefined();

		// Save items
		storeInBrowserStorage(storage, icon0);
		storeInBrowserStorage(storage, icon1);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// lastModified should be set to maximum value
		expect(storage.lastModifiedCached).toBe(lastModified1);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			1
		);

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item0)
		);
		expect(cache.getItem(browserCachePrefix + '1')).toBeFalsy();
		expect(cache.getItem(browserCacheCountKey)).toBe('1');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Adding icon set on unused spot', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix);

		// Add icon sets
		const icon0: IconifyJSON = {
			prefix: prefix,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon0,
		};
		const icon1: IconifyJSON = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item1: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon1,
		};

		// Add item
		cache.setItem(browserCacheVersionKey, browserCacheVersion);
		cache.setItem(browserCacheCountKey, '2');
		cache.setItem(browserCachePrefix + '1', JSON.stringify(item1));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Load data
		initBrowserStorage();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set([0]),
			session: new Set(),
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			2
		);

		// Save items
		storeInBrowserStorage(storage, icon0);

		// Check data
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			2
		);

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item0)
		);
		expect(cache.getItem(browserCachePrefix + '1')).toBe(
			JSON.stringify(item1)
		);
		expect(cache.getItem(browserCacheCountKey)).toBe('2');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Adding multiple icon sets to existing data', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix);

		// Add icon sets
		const icons: IconifyJSON[] = [];
		const items: BrowserStorageItem[] = [];
		for (let i = 0; i < 12; i++) {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['foo' + i.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data: icon,
			};

			// Make items 2 and 4 expire
			if (i === 2 || i === 4) {
				item.cached -= browserStorageCacheExpiration + 1;
			}

			// Change expiration for items 6 and 8 to almost expire
			if (i === 6 || i === 8) {
				item.cached -= browserStorageCacheExpiration - 1;
			}

			icons.push(icon);
			items.push(item);

			// Skip items 1, 5, 9+
			if (i !== 1 && i !== 5 && i < 9) {
				cache.setItem(
					browserCachePrefix + i.toString(),
					JSON.stringify(item)
				);
			}
		}

		cache.setItem(browserCacheVersionKey, browserCacheVersion);
		cache.setItem(browserCacheCountKey, '10');

		// Set cache
		reset({
			sessionStorage: cache,
		});

		// Load data
		initBrowserStorage();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: false,
			session: true,
		});

		// Counter should have changed to 9 after validation because last item is missing
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			9
		);

		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			// mix of expired and skipped items
			// reverse order, 9 should not be there because it is last item
			session: new Set([5, 4, 2, 1]),
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('9');

		// Check cached items
		[0, 3, 6, 7, 8].forEach((index) => {
			expect(cache.getItem(browserCachePrefix + index.toString())).toBe(
				JSON.stringify(items[index])
			);
		});

		// Check expired items - should have been deleted
		// Also check items that weren't supposed to be added
		[2, 4, 1, 5, 9, 10, 11, 12, 13].forEach((index) => {
			expect(
				cache.getItem(browserCachePrefix + index.toString())
			).toBeNull();
		});

		// Add item 5
		storeInBrowserStorage(storage, icons[5]);
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set([4, 2, 1]),
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('9');

		// Add items 4, 2, 1
		const list = [4, 2, 1];
		list.slice(0).forEach((index) => {
			expect(list.shift()).toBe(index);
			storeInBrowserStorage(storage, icons[index]);
			expect(browserStorageEmptyItems).toEqual({
				local: new Set(),
				session: new Set(list),
			});
			expect(cache.getItem(browserCacheCountKey)).toBe('9');
		});

		// Add item 10
		storeInBrowserStorage(storage, icons[10]);
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('10');

		// Add item 11
		storeInBrowserStorage(storage, icons[11]);
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('11');
	});

	it('Overwrite outdated data', () => {
		const prefix = nextPrefix();
		const cache = createCache();
		const storage = getStorage(provider, prefix);

		// Add data in old format
		cache.setItem(browserCacheVersionKey, '1.0.6');
		cache.setItem(browserCacheCountKey, '3');
		for (let i = 0; i < 3; i++) {
			cache.setItem(
				browserCachePrefix + i.toString(),
				JSON.stringify({
					prefix: prefix,
					icons: {
						['foo' + i.toString()]: {
							body: '<g></g>',
						},
					},
				})
			);
		}

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		expect(iconExists(storage, 'foo1')).toBe(false);

		// Load cache
		initBrowserStorage();

		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// Add one icon set
		const icon: IconifyJSON = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon,
		};

		// Save item
		storeInBrowserStorage(storage, icon);

		// Storing in cache should not add item to storage
		expect(iconExists(storage, 'foo')).toBe(false);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item)
		);
		expect(cache.getItem(browserCacheCountKey)).toBe('1');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Using both storage options', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();
		const storage = getStorage(provider, prefix);

		// Add icon sets to localStorage
		cache1.setItem(browserCacheVersionKey, browserCacheVersion);
		cache1.setItem(browserCacheCountKey, '3');
		[0, 1, 2].forEach((index) => {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['foo' + index.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data: icon,
			};
			cache1.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		});

		// Add icon sets to sessionStorage
		cache2.setItem(browserCacheVersionKey, browserCacheVersion);
		cache2.setItem(browserCacheCountKey, '4');
		[0, 1, 2, 3].forEach((index) => {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['bar' + index.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data: icon,
			};
			cache2.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		});

		// Set cache
		reset({
			localStorage: cache1,
			sessionStorage: cache2,
		});

		// Load data
		initBrowserStorage();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			3
		);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			4
		);

		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// Check icon storage
		for (let i = 0; i < 3; i++) {
			expect(iconExists(storage, 'foo' + i.toString())).toBe(true);
		}
		for (let i = 0; i < 4; i++) {
			expect(iconExists(storage, 'bar' + i.toString())).toBe(true);
		}

		// Add new item to localStorage
		const icon: IconifyJSON = {
			prefix: prefix,
			icons: {
				'new-icon': {
					body: '<g></g>',
				},
			},
		};
		const item: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon,
		};
		storeInBrowserStorage(storage, icon);

		// Check data
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			4 // +1
		);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			4
		);

		// Check cache
		expect(cache1.getItem(browserCachePrefix + '3')).toBe(
			JSON.stringify(item)
		);
	});

	it('Using both storage options, but localStorage is read only', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();
		const storage = getStorage(provider, prefix);

		// Add icon sets to localStorage
		cache1.setItem(browserCacheVersionKey, browserCacheVersion);
		cache1.setItem(browserCacheCountKey, '3');
		[0, 1, 2].forEach((index) => {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['foo' + index.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data: icon,
			};
			cache1.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		});

		// Add icon sets to sessionStorage
		cache2.setItem(browserCacheVersionKey, browserCacheVersion);
		cache2.setItem(browserCacheCountKey, '4');
		[0, 1, 2, 3].forEach((index) => {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['bar' + index.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data: icon,
			};
			cache2.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		});

		// Set cache
		reset({
			localStorage: cache1,
			sessionStorage: cache2,
		});

		// Load data
		initBrowserStorage();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			3
		);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			4
		);

		// Check icon storage
		for (let i = 0; i < 3; i++) {
			expect(iconExists(storage, 'foo' + i.toString())).toBe(true);
		}
		for (let i = 0; i < 4; i++) {
			expect(iconExists(storage, 'bar' + i.toString())).toBe(true);
		}

		// Set localStorage to read-only
		cache1.canWrite = false;

		// Add new item to localStorage
		const icon: IconifyJSON = {
			prefix: prefix,
			icons: {
				'new-icon': {
					body: '<g></g>',
				},
			},
		};
		const item: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider,
			data: icon,
		};
		storeInBrowserStorage(storage, icon);

		// Check data
		expect(browserStorageEmptyItems).toEqual({
			local: new Set(),
			session: new Set(),
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			3
		);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			5 // +1
		);

		// Check cache
		expect(cache2.getItem(browserCachePrefix + '4')).toBe(
			JSON.stringify(item)
		);
	});
});
