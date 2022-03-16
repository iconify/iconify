import type { IconifyJSON } from '@iconify/types';
import type { StoredItem } from '../../lib/browser-storage';
import { loadCache, count, config, emptyList } from '../../lib/browser-storage';
import { getStorage, iconExists } from '../../lib/storage/storage';
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
} from '../../lib/browser-storage/mock';

describe('Testing loading from localStorage', () => {
	const provider = '';

	it('Valid icon set', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');

		const item: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo: {
						body: '<g></g>',
					},
				},
			},
		};
		cache.setItem(cachePrefix + '0', JSON.stringify(item));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should exist now
		expect(iconExists(icons, 'foo')).toBe(true);

		// Check data
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
	});

	it('Different provider', () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');

		const item: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo: {
						body: '<g></g>',
					},
				},
			},
		};
		cache.setItem(cachePrefix + '0', JSON.stringify(item));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check default provider
		const icons2 = getStorage('', prefix);
		expect(iconExists(icons2, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should exist now
		expect(iconExists(icons, 'foo')).toBe(true);
		expect(iconExists(icons2, 'foo')).toBe(false);

		// Check data
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
	});

	it('Expired icon set', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');

		const item: StoredItem = {
			// Expiration date
			cached: Math.floor(Date.now() / hour) - cacheExpiration - 1,
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo: {
						body: '<g></g>',
					},
				},
			},
		};
		cache.setItem(cachePrefix + '0', JSON.stringify(item));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should not have loaded
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data
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
	});

	it('Bad icon set', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');
		cache.setItem(
			cachePrefix + '0',
			JSON.stringify({
				cached: Math.floor(Date.now() / hour),
				provider,
				data: {
					prefix: prefix,
					icons: {
						foo: {
							// Missing 'body' property
							width: 20,
						},
					},
				},
			})
		);

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should not have loaded
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data
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
	});

	it('Wrong counter', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '0'); // Should be at least "1"

		const item: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo: {
						body: '<g></g>',
					},
				},
			},
		};
		cache.setItem(cachePrefix + '0', JSON.stringify(item));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should not have loaded
		expect(iconExists(icons, 'foo')).toBe(false);

		// Check data
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
	});

	it('Missing entries at the end', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '5');

		const item: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo: {
						body: '<g></g>',
					},
				},
			},
		};
		cache.setItem(cachePrefix + '0', JSON.stringify(item));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo')).toBe(false);

		// Load localStorage
		loadCache();

		// Icon should exist now
		expect(iconExists(icons, 'foo')).toBe(true);

		// Check data
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
	});

	it('Missing entries', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add two icon sets
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '5');

		// Missing: 0, 2, 3
		const item1: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo1: {
						body: '<g></g>',
					},
				},
			},
		};
		const item4: StoredItem = {
			cached: Math.floor(Date.now() / hour),
			provider,
			data: {
				prefix: prefix,
				icons: {
					foo4: {
						body: '<g></g>',
					},
				},
			},
		};

		cache.setItem(cachePrefix + '1', JSON.stringify(item1));
		cache.setItem(cachePrefix + '4', JSON.stringify(item4));

		// Set cache
		reset({
			localStorage: cache,
		});

		// Check icon storage
		const icons = getStorage(provider, prefix);
		expect(iconExists(icons, 'foo1')).toBe(false);
		expect(iconExists(icons, 'foo4')).toBe(false);

		// Load localStorage
		loadCache();

		// Icons should exist now
		expect(iconExists(icons, 'foo1')).toBe(true);
		expect(iconExists(icons, 'foo4')).toBe(true);

		// Check data
		expect(config).toEqual({
			local: true,
			session: false,
		});
		expect(count).toEqual({
			local: 5,
			session: 0,
		});
		expect(emptyList).toEqual({
			local: [3, 2, 0], // reserse order
			session: [],
		});
	});

	it('Using both storage options', () => {
		const prefix = nextPrefix();
		const cache1 = createCache();
		const cache2 = createCache();

		// Add few icon sets
		cache1.setItem(versionKey, cacheVersion);
		cache2.setItem(versionKey, cacheVersion);

		cache1.setItem(countKey, '6');
		cache2.setItem(countKey, '3');

		// Create 5 items
		const icons: IconifyJSON[] = [];
		const items: StoredItem[] = [];

		for (let i = 0; i < 6; i++) {
			const icon: IconifyJSON = {
				prefix: prefix,
				icons: {
					['foo' + i.toString()]: {
						body: '<g></g>',
					},
				},
			};
			const item: StoredItem = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data: icon,
			};
			icons.push(icon);
			items.push(item);
		}

		// Add items 1,3,5 to localStorage
		[1, 3, 5].forEach((index) => {
			cache1.setItem(
				cachePrefix + index.toString(),
				JSON.stringify(items[index])
			);
		});

		// Add items 0 and 2 to sessionStorage
		[0, 2].forEach((index) => {
			cache2.setItem(
				cachePrefix + index.toString(),
				JSON.stringify(items[index])
			);
		});

		// Set cache
		reset({
			localStorage: cache1,
			sessionStorage: cache2,
		});

		// Check icon storage
		const iconsStorage = getStorage(provider, prefix);
		for (let i = 0; i < 6; i++) {
			expect(iconExists(iconsStorage, 'foo' + i.toString())).toBe(false);
		}

		// Load localStorage
		loadCache();

		// Icons should exist now, except for number 4
		for (let i = 0; i < 6; i++) {
			expect(iconExists(iconsStorage, 'foo' + i.toString())).toBe(
				i !== 4
			);
		}

		// Check data
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 6,
			session: 3,
		});
		expect(emptyList).toEqual({
			local: [4, 2, 0],
			session: [1],
		});
	});
});
