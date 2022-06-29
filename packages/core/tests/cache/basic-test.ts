import { initBrowserStorage } from '../../lib/browser-storage';
import { browserStorageConfig } from '../../lib/browser-storage/data';
import {
	browserCacheCountKey,
	browserCachePrefix,
	browserCacheVersion,
	browserCacheVersionKey,
} from '../../lib/browser-storage/config';
import { getBrowserStorageItemsCount } from '../../lib/browser-storage/count';
import { getBrowserStorage } from '../../lib/browser-storage/global';
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

		// No storage available
		expect(getBrowserStorage('local')).toBeUndefined();
		expect(getBrowserStorage('session')).toBeUndefined();

		// Attempt to load
		initBrowserStorage();

		// Everything should be disabled
		expect(browserStorageConfig).toEqual({
			local: false,
			session: false,
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

		// Only locaStorage should be available
		expect(getBrowserStorage('local')).toBeDefined();
		expect(getBrowserStorage('session')).toBeUndefined();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);

		// Attempt to load
		initBrowserStorage();

		// sessionStorage should be disabled
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});

		// Nothing should have loaded
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);
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

		// Storage should not be available
		expect(getBrowserStorage('local')).toBeUndefined();
		expect(getBrowserStorage('session')).toBeUndefined();

		// Attempt to load
		initBrowserStorage();

		// Everything should be disabled because read-only mock throws errors
		expect(browserStorageConfig).toEqual({
			local: false,
			session: false,
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

		// localStorage should be available
		expect(getBrowserStorage('local')).toBeDefined();
		expect(getBrowserStorage('session')).toBeUndefined();

		// Attempt to load
		initBrowserStorage();

		// sessionStorage should be disabled
		expect(browserStorageConfig).toEqual({
			local: true,
			session: false,
		});

		// One item should be in localStorage
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			1
		);
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

		// Storage should be available
		expect(getBrowserStorage('local')).toBeDefined();
		expect(getBrowserStorage('session')).toBeDefined();

		// Storage should be empty
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('local')!)).toBe(
			0
		);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(getBrowserStorageItemsCount(getBrowserStorage('session')!)).toBe(
			0
		);

		// Attempt to load
		initBrowserStorage();

		// Everything should be working
		expect(browserStorageConfig).toEqual({
			local: true,
			session: true,
		});
	});
});
