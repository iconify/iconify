import type { IconifyJSON } from '@iconify/types';
import type { CacheIcons } from '../cache';
import { browserCachePrefix, browserStorageHour } from './config';
import { setBrowserStorageItemsCount } from './count';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
	browserStorageItemsCount,
	browserStorageLoaded,
} from './data';
import { getBrowserStorage } from './global';
import { loadBrowserStorageCache } from './load';
import type { BrowserStorageConfig, BrowserStorageItem } from './types';

/**
 * Function to cache icons
 */
export const storeCache: CacheIcons = (
	provider: string,
	data: IconifyJSON
): void => {
	if (!browserStorageLoaded) {
		loadBrowserStorageCache();
	}

	function store(key: keyof BrowserStorageConfig): boolean {
		if (!browserStorageConfig[key]) {
			return false;
		}

		const func = getBrowserStorage(key);
		if (!func) {
			return false;
		}

		// Get item index
		let index = browserStorageEmptyItems[key].shift();
		if (index === void 0) {
			// Create new index
			index = browserStorageItemsCount[key];
			if (!setBrowserStorageItemsCount(func, key, index + 1)) {
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
