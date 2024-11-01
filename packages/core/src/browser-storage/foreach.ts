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
import { browserStorageEmptyItems } from './data';
import { getBrowserStorage } from './global';
import { getStoredItem, removeStoredItem, setStoredItem } from './item';
import type { BrowserStorageConfig, BrowserStorageItem } from './types';

// Result of callback. false = delete item
type IterateBrowserStorageCallbackResult = true | false;

// Callback
type IterateBrowserStorageCallback = (
	item: BrowserStorageItem,
	index: number
) => IterateBrowserStorageCallbackResult;

/**
 * Iterate items in browser storage
 */
export function iterateBrowserStorage(
	key: keyof BrowserStorageConfig,
	callback: IterateBrowserStorageCallback
) {
	const func = getBrowserStorage(key);
	if (!func) {
		return;
	}

	// Get version
	const version = getStoredItem(func, browserCacheVersionKey);
	if (version !== browserCacheVersion) {
		if (version) {
			// Version is set, but invalid - remove old entries
			const total = getBrowserStorageItemsCount(func);
			for (let i = 0; i < total; i++) {
				removeStoredItem(func, browserCachePrefix + i.toString());
			}
		}

		// Empty data
		setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
		setBrowserStorageItemsCount(func, 0);
		return;
	}

	// Minimum time
	const minTime =
		Math.floor(Date.now() / browserStorageHour) -
		browserStorageCacheExpiration;

	// Parse item
	const parseItem = (index: number): true | undefined => {
		const name = browserCachePrefix + index.toString();
		const item = getStoredItem(func, name);

		if (typeof item !== 'string') {
			// Does not exist
			return;
		}

		// Get item, validate it
		try {
			// Parse, check time stamp
			const data = JSON.parse(item) as BrowserStorageItem;
			if (
				typeof data === 'object' &&
				typeof data.cached === 'number' &&
				data.cached > minTime &&
				typeof data.provider === 'string' &&
				typeof data.data === 'object' &&
				typeof data.data.prefix === 'string' &&
				// Valid item: run callback
				callback(data, index)
			) {
				return true;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			//
		}

		// Remove item
		removeStoredItem(func, name);
	};

	let total = getBrowserStorageItemsCount(func);
	for (let i = total - 1; i >= 0; i--) {
		if (!parseItem(i)) {
			if (i === total - 1) {
				// Last item - reduce count
				total--;
				setBrowserStorageItemsCount(func, total);
			} else {
				// Mark as empty
				browserStorageEmptyItems[key].add(i);
			}
		}
	}
}
