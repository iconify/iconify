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
import { iterateBrowserStorage } from './foreach';
import { getBrowserStorage } from './global';
import { initBrowserStorage } from './index';
import { setStoredItem } from './item';
import type {
	BrowserStorageInstance,
	BrowserStorageItem,
	BrowserStorageType,
	IconStorageWithCache,
} from './types';

/**
 * Update lastModified in storage
 *
 * Returns false if item should not be added to storage because lastModified is too low
 */
export function updateLastModified(
	storage: IconStorageWithCache,
	lastModified: number
): boolean {
	const lastValue = storage.lastModifiedCached;
	if (
		// Matches or newer
		lastValue &&
		lastValue >= lastModified
	) {
		// Nothing to update
		return lastValue === lastModified;
	}

	// Update value
	storage.lastModifiedCached = lastModified;
	if (lastValue) {
		// Old value was set: possibly items are in browser cache
		for (const key in browserStorageConfig) {
			iterateBrowserStorage(key as BrowserStorageType, (item) => {
				const iconSet = item.data;
				// Delete items with same provider and prefix
				return (
					item.provider !== storage.provider ||
					iconSet.prefix !== storage.prefix ||
					iconSet.lastModified === lastModified
				);
			});
		}
	}

	return true;
}

/**
 * Function to cache icons
 */
export function storeInBrowserStorage(storage: IconStorage, data: IconifyJSON) {
	if (!browserStorageStatus) {
		initBrowserStorage();
	}

	function store(key: BrowserStorageType): true | undefined {
		let func: BrowserStorageInstance | undefined;
		if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
			return;
		}

		// Get item index
		const set = browserStorageEmptyItems[key];
		let index: number;
		if (set.size) {
			// Remove item from set
			set.delete((index = Array.from(set).shift() as number));
		} else {
			// Create new index
			index = getBrowserStorageItemsCount(func);
			if (!setBrowserStorageItemsCount(func, index + 1)) {
				return;
			}
		}

		// Create and save item
		const item: BrowserStorageItem = {
			cached: Math.floor(Date.now() / browserStorageHour),
			provider: storage.provider,
			data,
		};

		return setStoredItem(
			func,
			browserCachePrefix + index.toString(),
			JSON.stringify(item)
		);
	}

	// Update lastModified
	if (data.lastModified && !updateLastModified(storage, data.lastModified)) {
		return;
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
