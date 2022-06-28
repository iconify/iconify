import { loadBrowserStorageCache } from '../../lib/browser-storage/load';
import {
	browserStorageItemsCount,
	browserStorageConfig,
} from '../../lib/browser-storage/data';
import {
	browserCacheCountKey,
	browserCachePrefix,
	browserCacheVersion,
	browserCacheVersionKey,
} from '../../lib/browser-storage/config';
import { nextPrefix, createCache, reset } from '../../lib/browser-storage/mock';

describe('Testing mocked localStorage', () => {
	const provider = '';

	it('No usable cache', () => {
		reset({});

		// Config before tests
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadBrowserStorageCache();

		// Everything should be disabled
		expect(browserStorageConfig).toEqual({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});
	});

	it('Empty localStorage', () => {
		reset({
			localStorage: createCache(),
		});

		// Config before tests
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadBrowserStorageCache();

		// sessionStorage should be disabled
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});

		// Nothing should have loaded
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});
	});

	it('Restricted localStorage', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one item
		cache.setItem(browserCacheVersionKey, browserCacheVersion);
		cache.setItem(browserCacheCountKey, '1');
		cache.setItem(
			browserCachePrefix + '0',
			JSON.stringify({
				cached: Date.now(),
				provider,
				data: {
					prefix: prefix,
					icons: {
						foo: {
							body: '<g></g>',
						},
					},
				},
			})
		);

		// Prevent reading and writing
		cache.canRead = false;
		cache.canWrite = false;

		// Set cache and test it
		reset({
			localStorage: cache,
			sessionStorage: cache,
		});

		// Config before tests
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadBrowserStorageCache();

		// Everything should be disabled because read-only mock throws errors
		expect(browserStorageConfig).toEqual({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});
	});

	it('localStorage with one item', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(browserCacheVersionKey, browserCacheVersion);
		cache.setItem(browserCacheCountKey, '1');
		cache.setItem(
			browserCachePrefix + '0',
			JSON.stringify({
				cached: Date.now(),
				provider,
				data: {
					prefix: prefix,
					icons: {
						foo: {
							body: '<g></g>',
						},
					},
				},
			})
		);

		// Set cache and test it
		reset({
			localStorage: cache,
		});

		// Config before tests
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadBrowserStorageCache();

		// sessionStorage should be disabled
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});

		// One item should be in localStorage
		expect(browserStorageItemsCount).toEqual({
			local: 1,
			session: 0,
		});
	});

	it('localStorage and sessionStorage', () => {
		reset({
			localStorage: createCache(),
			sessionStorage: createCache(),
		});

		// Config before tests
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadBrowserStorageCache();

		// Everything should be working
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});

		// Empty storage
		expect(browserStorageItemsCount).toEqual({
			local: 0,
			session: 0,
		});
	});
});
