import type { IconifyJSON } from '@iconify/types';
import type { IconStorage } from '../storage/storage';
import { browserCachePrefix, browserStorageHour } from './config';
import {
	getBrowserStorageItemsCount,
	setBrowserStorageItemsCount,
} from './count';
import {
	browserStorageConfig,
	browserStorageEmptyItems,
	browserStorageStatus,
} from './data';
import { getBrowserStorage } from './global';
import { initBrowserStorage } from './index';
import type { BrowserStorageItem, BrowserStorageType } from './types';

/**
 * Function to cache icons
 */
export function storeInBrowserStorage(storage: IconStorage, data: IconifyJSON) {
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
		const set = browserStorageEmptyItems[key];
		let index: number;
		if (set.size) {
			// Remove item from set
			index = Array.from(set).shift() as number;
			set.delete(index);
		} else {
			// Create new index
			index = getBrowserStorageItemsCount(func);
			if (!setBrowserStorageItemsCount(func, index + 1)) {
				return;
			}
		}

		// Create and save item
		try {
			const item: BrowserStorageItem = {
				cached: Math.floor(Date.now() / browserStorageHour),
				provider: storage.provider,
				data,
			};
			func.setItem(
				browserCachePrefix + index.toString(),
				JSON.stringify(item)
			);
		} catch (err) {
			return;
		}

		// Success
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
}
