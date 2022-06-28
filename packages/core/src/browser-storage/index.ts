import { addIconSet, getStorage } from '../storage/storage';
import {
	browserCachePrefix,
	browserCacheVersion,
	browserCacheVersionKey,
	browserStorageCacheExpiration,
	browserStorageHour,
} from './config';
import {
	getBrowserStorageItemsCount,
	setBrowserStorageItemsCount,
} from './count';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
	browserStorageStatus,
	setBrowserStorageStatus,
} from './data';
import { getBrowserStorage } from './global';
import type { BrowserStorageConfig, BrowserStorageItem } from './types';

/**
 * Load icons from cache
 */
export function initBrowserStorage() {
	if (browserStorageStatus === true) {
		return;
	}
	setBrowserStorageStatus('loading');

	// Minimum time
	const minTime =
		Math.floor(Date.now() / browserStorageHour) -
		browserStorageCacheExpiration;

	// Load data from storage
	function load(key: keyof BrowserStorageConfig): void {
		const func = getBrowserStorage(key);
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
					try {
						const total = getBrowserStorageItemsCount(func);
						for (let i = 0; i < total; i++) {
							func.removeItem(browserCachePrefix + i.toString());
						}
					} catch (err) {
						//
					}
				}

				// Empty data
				try {
					func.setItem(browserCacheVersionKey, browserCacheVersion);
				} catch (err) {
					//
				}
				setBrowserStorageItemsCount(func, key, 0);
				return;
			}

			// Get number of stored items
			let total = getBrowserStorageItemsCount(func);
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
			setBrowserStorageItemsCount(func, key, total);
		} catch (err) {
			//
		}
	}

	for (const key in browserStorageConfig) {
		load(key as keyof BrowserStorageConfig);
	}

	setBrowserStorageStatus(true);
}
