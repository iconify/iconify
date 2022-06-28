import type { IconifyJSON } from '@iconify/types';
import type { BrowserStorageItem } from '../../lib/browser-storage/types';
import { storeCache } from '../../lib/browser-storage';
import { loadBrowserStorageCache } from '../../lib/browser-storage/load';
import {
	browserStorageItemsCount,
	browserStorageConfig,
	browserStorageEmptyItems,
} from '../../lib/browser-storage/data';
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
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Save item
		storeCache(provider, icon);

		// Storing in cache should not add item to storage
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 1,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache.getItem(browserCachePrefix + '0')).toBe(
			JSON.stringify(item)
		);
		expect(cache.getItem(browserCacheCountKey)).toBe('1');
		expect(cache.getItem(browserCacheVersionKey)).toBe(browserCacheVersion);
	});

	it('Multiple icon sets', () => {
		const prefix = nextPrefix();
		const cache = createCache();

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

		// Set cache
		reset({
			localStorage: cache,
		});

		// Save items
		storeCache(provider, icon0);
		storeCache(provider, icon1);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 2,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

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

	it('Adding icon set on unused spot', () => {
		const prefix = nextPrefix();
		const cache = createCache();

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
		loadBrowserStorageCache();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 2,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [0],
			session: [],
		});

		// Save items
		storeCache(provider, icon0);

		// Check data
		expect(browserStorageItemsCount).toEqual({
			local: 2,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

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
		loadBrowserStorageCache();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: false,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 9, // item 9 was missing
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			// mix of expired and skipped items
			// reverse order, 9 should not be there because it is last item
			session: [5, 4, 2, 1],
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
		storeCache(provider, icons[5]);
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 9,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [4, 2, 1],
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('9');

		// Add items 4, 2, 1
		const list = [4, 2, 1];
		list.slice(0).forEach((index) => {
			expect(list.shift()).toBe(index);
			storeCache(provider, icons[index]);
			expect(browserStorageItemsCount).toEqual({
				local: 0,
				session: 9,
			});
			expect(browserStorageEmptyItems).toEqual({
				local: [],
				session: list,
			});
			expect(cache.getItem(browserCacheCountKey)).toBe('9');
		});

		// Add item 10
		storeCache(provider, icons[10]);
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 10,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('10');

		// Add item 11
		storeCache(provider, icons[11]);
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 11,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});
		expect(cache.getItem(browserCacheCountKey)).toBe('11');
	});

	it('Overwrite outdated data', () => {
		const prefix = nextPrefix();
		const cache = createCache();

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
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo1')).toBe(false);

		// Load cache
		loadBrowserStorageCache();

		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
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
		storeCache(provider, icon);

		// Storing in cache should not add item to storage
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 1,
			session: 0,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
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
		loadBrowserStorageCache();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 3,
			session: 4,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

		// Check icon storage
		const iconsStorage = getStorage(provider, prefix);
		for (let i = 0; i < browserStorageItemsCount.local; i++) {
			expect(iconExists(iconsStorage, 'foo' + i.toString())).toBe(true);
		}
		for (let i = 0; i < browserStorageItemsCount.session; i++) {
			expect(iconExists(iconsStorage, 'bar' + i.toString())).toBe(true);
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
		storeCache(provider, icon);

		// Check data
		expect(browserStorageItemsCount).toEqual({
			local: 4, // +1
			session: 4,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache1.getItem(browserCachePrefix + '3')).toBe(
			JSON.stringify(item)
		);
	});

	it('Using both storage options, but localStorage is read only', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();

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
		loadBrowserStorageCache();

		// Check data
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 3,
			session: 4,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

		// Check icon storage
		const iconsStorage = getStorage(provider, prefix);
		for (let i = 0; i < browserStorageItemsCount.local; i++) {
			expect(iconExists(iconsStorage, 'foo' + i.toString())).toBe(true);
		}
		for (let i = 0; i < browserStorageItemsCount.session; i++) {
			expect(iconExists(iconsStorage, 'bar' + i.toString())).toBe(true);
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
		storeCache(provider, icon);

		// Check data
		expect(browserStorageItemsCount).toEqual({
			local: 3,
			session: 5,
		});
		expect(browserStorageEmptyItems).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache2.getItem(browserCachePrefix + '4')).toBe(
			JSON.stringify(item)
		);
	});
});
