import type { IconifyJSON } from '@iconify/types';
import type { CacheIcons, LoadIconsCache } from '../cache';
import { getStorage, addIconSet } from '../storage/storage';
import {
	browserCacheCountKey,
	browserCachePrefix,
	browserCacheVersion,
	browserCacheVersionKey,
	browserStorageCacheExpiration,
	browserStorageHour,
} from './config';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
	browserStorageItemsCount,
} from './data';
import type { BrowserStorageConfig, BrowserStorageItem } from './types';

/**
 * Flag to check if storage has been loaded
 */
let loaded = false;

/**
 * Fake window for unit testing
 */
type FakeWindow = Record<string, typeof localStorage>;

let _window: FakeWindow =
	typeof window === 'undefined' ? {} : (window as unknown as FakeWindow);
export function mock(fakeWindow: FakeWindow): void {
	loaded = false;
	_window = fakeWindow;
}

/**
 * Get global
 *
 * @param key
 */
function getGlobal(
	key: keyof BrowserStorageConfig
): typeof localStorage | null {
	const attr = key + 'Storage';
	try {
		if (
			_window &&
			_window[attr] &&
			typeof _window[attr].length === 'number'
		) {
			return _window[attr];
		}
	} catch (err) {
		//
	}

	// Failed - mark as disabled
	browserStorageConfig[key] = false;
	return null;
}

/**
 * Change current count for storage
 */
function setCount(
	storage: typeof localStorage,
	key: keyof BrowserStorageConfig,
	value: number
): boolean {
	try {
		storage.setItem(browserCacheCountKey, value.toString());
		browserStorageItemsCount[key] = value;
		return true;
	} catch (err) {
		//
	}
	return false;
}

/**
 * Get current count from storage
 *
 * @param storage
 */
function getCount(storage: typeof localStorage): number {
	const count = storage.getItem(browserCacheCountKey);
	if (count) {
		const total = parseInt(count);
		return total ? total : 0;
	}
	return 0;
}

/**
 * Initialize storage
 *
 * @param storage
 * @param key
 */
function initCache(
	storage: typeof localStorage,
	key: keyof BrowserStorageConfig
): void {
	try {
		storage.setItem(browserCacheVersionKey, browserCacheVersion);
	} catch (err) {
		//
	}
	setCount(storage, key, 0);
}

/**
 * Destroy old cache
 *
 * @param storage
 */
function destroyCache(storage: typeof localStorage): void {
	try {
		const total = getCount(storage);
		for (let i = 0; i < total; i++) {
			storage.removeItem(browserCachePrefix + i.toString());
		}
	} catch (err) {
		//
	}
}

/**
 * Load icons from cache
 */
export const loadCache: LoadIconsCache = (): void => {
	if (loaded) {
		return;
	}
	loaded = true;

	// Minimum time
	const minTime =
		Math.floor(Date.now() / browserStorageHour) -
		browserStorageCacheExpiration;

	// Load data from storage
	function load(key: keyof BrowserStorageConfig): void {
		const func = getGlobal(key);
		if (!func) {
			return;
		}

		// Get one item from storage
		const getItem = (index: number): boolean => {
			const name = browserCachePrefix + index.toString();
			const item = func.getItem(name);

			if (typeof item !== 'string') {
				// Does not exist
				return false;
			}

			// Get item, validate it
			let valid = true;
			try {
				// Parse, check time stamp
				const data = JSON.parse(item) as BrowserStorageItem;
				if (
					typeof data !== 'object' ||
					typeof data.cached !== 'number' ||
					data.cached < minTime ||
					typeof data.provider !== 'string' ||
					typeof data.data !== 'object' ||
					typeof data.data.prefix !== 'string'
				) {
					valid = false;
				} else {
					// Add icon set
					const provider = data.provider;
					const prefix = data.data.prefix;
					const storage = getStorage(provider, prefix);
					valid = addIconSet(storage, data.data).length > 0;
				}
			} catch (err) {
				valid = false;
			}

			if (!valid) {
				func.removeItem(name);
			}
			return valid;
		};

		try {
			// Get version
			const version = func.getItem(browserCacheVersionKey);
			if (version !== browserCacheVersion) {
				if (version) {
					// Version is set, but invalid - remove old entries
					destroyCache(func);
				}
				// Empty data
				initCache(func, key);
				return;
			}

			// Get number of stored items
			let total = getCount(func);
			for (let i = total - 1; i >= 0; i--) {
				if (!getItem(i)) {
					// Remove item
					if (i === total - 1) {
						// Last item - reduce country
						total--;
					} else {
						// Mark as empty
						browserStorageEmptyItems[key].push(i);
					}
				}
			}

			// Update total
			setCount(func, key, total);
		} catch (err) {
			//
		}
	}

	for (const key in browserStorageConfig) {
		load(key as keyof BrowserStorageConfig);
	}
};

/**
 * Function to cache icons
 */
export const storeCache: CacheIcons = (
	provider: string,
	data: IconifyJSON
): void => {
	if (!loaded) {
		loadCache();
	}

	function store(key: keyof BrowserStorageConfig): boolean {
		if (!browserStorageConfig[key]) {
			return false;
		}

		const func = getGlobal(key);
		if (!func) {
			return false;
		}

		// Get item index
		let index = browserStorageEmptyItems[key].shift();
		if (index === void 0) {
			// Create new index
			index = browserStorageItemsCount[key];
			if (!setCount(func, key, index + 1)) {
				return false;
			}
		}

		// Create and save item
		try {
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider,
				data,
			};
			func.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		} catch (err) {
			return false;
		}
		return true;
	}

	// Do not store empty sets
	if (!Object.keys(data.icons).length) {
		return;
	}

	// Remove not_found (clone object to keep old object intact)
	if (data.not_found) {
		data = Object.assign({}, data);
		delete data.not_found;
	}

	// Attempt to store at localStorage first, then at sessionStorage
	if (!store('local')) {
		store('session');
	}
};
