import {
	loadCache,
	storeCache,
	count,
	config,
	emptyList,
} from '@iconify/core/lib/browser-storage';
import { getStorage, iconExists } from '@iconify/core/lib/storage/storage';
import {
	nextPrefix,
	createCache,
	reset,
	cachePrefix,
	cacheVersion,
	versionKey,
	countKey,
	hour,
	cacheExpiration,
} from './fakeCache.mjs';

describe('Testing saving to localStorage', () => {
	const provider = '';

	it('One icon set', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		const icon = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item = {
			cached: Math.floor(Date.now() / hour),
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
		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 1,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache.getItem(cachePrefix + '0')).toBe(JSON.stringify(item));
		expect(cache.getItem(countKey)).toBe('1');
		expect(cache.getItem(versionKey)).toBe(cacheVersion);
	});

	it('Multiple icon sets', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add icon sets
		const icon0 = {
			prefix: prefix,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0 = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon0,
		};
		const icon1 = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item1 = {
			cached: Math.floor(Date.now() / hour),
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
		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 2,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache.getItem(cachePrefix + '0')).toBe(JSON.stringify(item0));
		expect(cache.getItem(cachePrefix + '1')).toBe(JSON.stringify(item1));
		expect(cache.getItem(countKey)).toBe('2');
		expect(cache.getItem(versionKey)).toBe(cacheVersion);
	});

	it('Adding icon set on unused spot', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add icon sets
		const icon0 = {
			prefix: prefix,
			icons: {
				foo0: {
					body: '<g></g>',
				},
			},
		};
		const item0 = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon0,
		};
		const icon1 = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item1 = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon1,
		};

		// Add item
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '2');
		cache.setItem(cachePrefix + '1', JSON.stringify(item1));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Load data
		loadCache();

		// Check data
		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 2,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [0],
			session: [],
		});

		// Save items
		storeCache(provider, icon0);

		// Check data
		expect(count).toEqual({
			local: 2,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache.getItem(cachePrefix + '0')).toBe(JSON.stringify(item0));
		expect(cache.getItem(cachePrefix + '1')).toBe(JSON.stringify(item1));
		expect(cache.getItem(countKey)).toBe('2');
		expect(cache.getItem(versionKey)).toBe(cacheVersion);
	});

	it('Adding multiple icon sets to existing data', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add icon sets
		const icons = [];
		const items = [];
		for (let i = 0; i < 12; i++) {
			const icon = {
				prefix: prefix,
				icons: {
					['foo' + i]: {
						body: '<g></g>',
					},
				},
			};
			const item = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};

			// Make items 2 and 4 expire
			if (i === 2 || i === 4) {
				item.cached -= cacheExpiration + 1;
			}

			// Change expiration for items 6 and 8 to almost expire
			if (i === 6 || i === 8) {
				item.cached -= cacheExpiration - 1;
			}

			icons.push(icon);
			items.push(item);

			// Skip items 1, 5, 9+
			if (i !== 1 && i !== 5 && i < 9) {
				cache.setItem(cachePrefix + i, JSON.stringify(item));
			}
		}

		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '10');

		// Set cache
		reset({
			sessionStorage: cache,
		});

		// Load data
		loadCache();

		// Check data
		expect(config).toEqual({
			local: false,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 9, // item 9 was missing
		});
		expect(emptyList).toEqual({
			local: [],
			// mix of expired and skipped items
			// reverse order, 9 should not be there because it is last item
			session: [5, 4, 2, 1],
		});
		expect(cache.getItem(countKey)).toBe('9');

		// Check cached items
		[0, 3, 6, 7, 8].forEach((index) => {
			expect(cache.getItem(cachePrefix + index)).toBe(
				JSON.stringify(items[index])
			);
		});

		// Check expired items - should have been deleted
		// Also check items that weren't supposed to be added
		[2, 4, 1, 5, 9, 10, 11, 12, 13].forEach((index) => {
			expect(cache.getItem(cachePrefix + index)).toBeNull();
		});

		// Add item 5
		storeCache(provider, icons[5]);
		expect(count).toEqual({
			local: 0,
			session: 9,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [4, 2, 1],
		});
		expect(cache.getItem(countKey)).toBe('9');

		// Add items 4, 2, 1
		const list = [4, 2, 1];
		list.slice(0).forEach((index) => {
			expect(list.shift()).toBe(index);
			storeCache(provider, icons[index]);
			expect(count).toEqual({
				local: 0,
				session: 9,
			});
			expect(emptyList).toEqual({
				local: [],
				session: list,
			});
			expect(cache.getItem(countKey)).toBe('9');
		});

		// Add item 10
		storeCache(provider, icons[10]);
		expect(count).toEqual({
			local: 0,
			session: 10,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});
		expect(cache.getItem(countKey)).toBe('10');

		// Add item 11
		storeCache(provider, icons[11]);
		expect(count).toEqual({
			local: 0,
			session: 11,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});
		expect(cache.getItem(countKey)).toBe('11');
	});

	it('Overwrite outdated data', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add data in old format
		cache.setItem(versionKey, '1.0.6');
		cache.setItem(countKey, '3');
		for (let i = 0; i < 3; i++) {
			cache.setItem(
				cachePrefix + i,
				JSON.stringify({
					prefix: prefix,
					icons: {
						['foo' + i]: {
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
		loadCache();

		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Add one icon set
		const icon = {
			prefix: prefix,
			icons: {
				foo: {
					body: '<g></g>',
				},
			},
		};
		const item = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon,
		};

		// Save item
		storeCache(provider, icon);

		// Storing in cache should not add item to storage
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data that should have been updated because storeCache()
		// should call load function before first execution
		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 1,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache.getItem(cachePrefix + '0')).toBe(JSON.stringify(item));
		expect(cache.getItem(countKey)).toBe('1');
		expect(cache.getItem(versionKey)).toBe(cacheVersion);
	});

	it('Using both storage options', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();

		// Add icon sets to localStorage
		cache1.setItem(versionKey, cacheVersion);
		cache1.setItem(countKey, '3');
		[0, 1, 2].forEach((index) => {
			const icon = {
				prefix: prefix,
				icons: {
					['foo' + index]: {
						body: '<g></g>',
					},
				},
			};
			const item = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};
			cache1.setItem(cachePrefix + index, JSON.stringify(item));
		});

		// Add icon sets to sessionStorage
		cache2.setItem(versionKey, cacheVersion);
		cache2.setItem(countKey, '4');
		[0, 1, 2, 3].forEach((index) => {
			const icon = {
				prefix: prefix,
				icons: {
					['bar' + index]: {
						body: '<g></g>',
					},
				},
			};
			const item = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};
			cache2.setItem(cachePrefix + index, JSON.stringify(item));
		});

		// Set cache
		reset({
			localStorage: cache1,
			sessionStorage: cache2,
		});

		// Load data
		loadCache();

		// Check data
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 3,
			session: 4,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check icon storage
		const iconsStorage = getStorage(provider, prefix);
		for (let i = 0; i < count.local; i++) {
			expect(iconExists(iconsStorage, 'foo' + i)).toBe(true);
		}
		for (let i = 0; i < count.session; i++) {
			expect(iconExists(iconsStorage, 'bar' + i)).toBe(true);
		}

		// Add new item to localStorage
		const icon = {
			prefix: prefix,
			icons: {
				'new-icon': {
					body: '<g></g>',
				},
			},
		};
		const item = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon,
		};
		storeCache(provider, icon);

		// Check data
		expect(count).toEqual({
			local: 4, // +1
			session: 4,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache1.getItem(cachePrefix + '3')).toBe(JSON.stringify(item));
	});

	it('Using both storage options, but localStorage is read only', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();

		// Add icon sets to localStorage
		cache1.setItem(versionKey, cacheVersion);
		cache1.setItem(countKey, '3');
		[0, 1, 2].forEach((index) => {
			const icon = {
				prefix: prefix,
				icons: {
					['foo' + index]: {
						body: '<g></g>',
					},
				},
			};
			const item = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};
			cache1.setItem(cachePrefix + index, JSON.stringify(item));
		});

		// Add icon sets to sessionStorage
		cache2.setItem(versionKey, cacheVersion);
		cache2.setItem(countKey, '4');
		[0, 1, 2, 3].forEach((index) => {
			const icon = {
				prefix: prefix,
				icons: {
					['bar' + index]: {
						body: '<g></g>',
					},
				},
			};
			const item = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};
			cache2.setItem(cachePrefix + index, JSON.stringify(item));
		});

		// Set cache
		reset({
			localStorage: cache1,
			sessionStorage: cache2,
		});

		// Load data
		loadCache();

		// Check data
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 3,
			session: 4,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check icon storage
		const iconsStorage = getStorage(provider, prefix);
		for (let i = 0; i < count.local; i++) {
			expect(iconExists(iconsStorage, 'foo' + i)).toBe(true);
		}
		for (let i = 0; i < count.session; i++) {
			expect(iconExists(iconsStorage, 'bar' + i)).toBe(true);
		}

		// Set localStorage to read-only
		cache1.canWrite = false;

		// Add new item to localStorage
		const icon = {
			prefix: prefix,
			icons: {
				'new-icon': {
					body: '<g></g>',
				},
			},
		};
		const item = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: icon,
		};
		storeCache(provider, icon);

		// Check data
		expect(count).toEqual({
			local: 3,
			session: 5,
		});
		expect(emptyList).toEqual({
			local: [],
			session: [],
		});

		// Check cache
		expect(cache2.getItem(cachePrefix + '4')).toBe(JSON.stringify(item));
	});
});
