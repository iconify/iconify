import type { IconifyJSON } from '@iconify/types';
import type { CacheIcons, LoadIconsCache } from '../cache';
import { getStorage, addIconSet } from '../storage/storage';

interface StorageType<T> {
	local: T;
	session: T;
}

type StorageConfig = StorageType<boolean>;
type StorageCount = StorageType<number>;
type StorageEmptyList = StorageType<number[]>;

export interface StoredItem {
	cached: number;
	provider: string;
	data: IconifyJSON;
}

// After changing configuration change it in tests/*/fake_cache.ts

// Cache version. Bump when structure changes
const cacheVersion = 'iconify2';

// Cache keys
const cachePrefix = 'iconify';
const countKey = cachePrefix + '-count';
const versionKey = cachePrefix + '-version';

/**
 * Cache expiration
 */
const hour = 3600000;
const cacheExpiration = 168; // In hours

/**
 * Storage configuration
 */
export const config: StorageConfig = {
	local: true,
	session: true,
};

/**
 * Flag to check if storage has been loaded
 */
let loaded = false;

/**
 * Items counter
 */
export const count: StorageCount = {
	local: 0,
	session: 0,
};

/**
 * List of empty items
 */
export const emptyList: StorageEmptyList = {
	local: [],
	session: [],
};

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
function getGlobal(key: keyof StorageConfig): typeof localStorage | null {
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
	config[key] = false;
	return null;
}

/**
 * Change current count for storage
 */
function setCount(
	storage: typeof localStorage,
	key: keyof StorageConfig,
	value: number
): boolean {
	try {
		storage.setItem(countKey, value + '');
		count[key] = value;
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Get current count from storage
 *
 * @param storage
 */
function getCount(storage: typeof localStorage): number {
	const count = storage.getItem(countKey);
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
	key: keyof StorageConfig
): void {
	try {
		storage.setItem(versionKey, cacheVersion);
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
			storage.removeItem(cachePrefix + i);
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
	const minTime = Math.floor(Date.now() / hour) - cacheExpiration;

	// Load data from storage
	function load(key: keyof StorageConfig): void {
		const func = getGlobal(key);
		if (!func) {
			return;
		}

		// Get one item from storage
		const getItem = (index: number): boolean => {
			const name = cachePrefix + index;
			const item = func.getItem(name);

			if (typeof item !== 'string') {
				// Does not exist
				return false;
			}

			// Get item, validate it
			let valid = true;
			try {
				// Parse, check time stamp
				const data = JSON.parse(item as string) as StoredItem;
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
			const version = func.getItem(versionKey);
			if (version !== cacheVersion) {
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
						emptyList[key].push(i);
					}
				}
			}

			// Update total
			setCount(func, key, total);
		} catch (err) {
			//
		}
	}

	for (const key in config) {
		load(key as keyof StorageConfig);
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

	function store(key: keyof StorageConfig): boolean {
		if (!config[key]) {
			return false;
		}

		const func = getGlobal(key);
		if (!func) {
			return false;
		}

		// Get item index
		let index = emptyList[key].shift();
		if (index === void 0) {
			// Create new index
			index = count[key];
			if (!setCount(func, key, index + 1)) {
				return false;
			}
		}

		// Create and save item
		try {
			const item: StoredItem = {
				cached: Math.floor(Date.now() / hour),
				provider,
				data,
			};
			func.setItem(cachePrefix + index, JSON.stringify(item));
		} catch (err) {
			return false;
		}
		return true;
	}

	// Attempt to store at localStorage first, then at sessionStorage
	if (!store('local')) {
		store('session');
	}
};
