import type { IconifyJSON } from '@iconify/types';
import { browserCachePrefix, browserStorageHour } from './config';
import { setBrowserStorageItemsCount } from './count';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
	browserStorageItemsCount,
	browserStorageStatus,
} from './data';
import { getBrowserStorage } from './global';
import { initBrowserStorage } from './index';
import type { BrowserStorageItem, BrowserStorageType } from './types';

/**
 * Function to cache icons
 */
export function storeInBrowserStorage(provider: string, data: IconifyJSON) {
	if (!browserStorageStatus) {
		initBrowserStorage();
	}

	function store(key: BrowserStorageType): true | undefined {
		if (!browserStorageConfig[key]) {
			return;
		}

		const func = getBrowserStorage(key);
		if (!func) {
			return;
		}

		// Get item index
		let index = browserStorageEmptyItems[key].shift();
		if (index === void 0) {
			// Create new index
			index = browserStorageItemsCount[key];
			if (!setBrowserStorageItemsCount(func, key, index + 1)) {
				return;
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
			return true;
		} catch (err) {
			//
		}
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
}
