import { count, config, loadCache } from '../../lib/browser-storage';
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
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be disabled
		expect(config).toEqual({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(count).toEqual({
			local: 0,
			session: 0,
		});
	});

	it('Empty localStorage', () => {
		reset({
			localStorage: createCache(),
		});

		// Config before tests
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// sessionStorage should be disabled
		expect(config).toEqual({
			local: true,
			session: false,
		});

		// Nothing should have loaded
		expect(count).toEqual({
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
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be disabled because read-only mock throws errors
		expect(config).toEqual({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(count).toEqual({
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
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// sessionStorage should be disabled
		expect(config).toEqual({
			local: true,
			session: false,
		});

		// One item should be in localStorage
		expect(count).toEqual({
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
		expect(config).toEqual({
			local: true,
			session: true,
		});
		expect(count).toEqual({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be working
		expect(config).toEqual({
			local: true,
			session: true,
		});

		// Empty storage
		expect(count).toEqual({
			local: 0,
			session: 0,
		});
	});
});
