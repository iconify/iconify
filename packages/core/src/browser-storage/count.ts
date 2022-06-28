import { browserCacheCountKey } from './config';
import { browserStorageItemsCount } from './data';
import type { BrowserStorageType } from './types';

/**
 * Change current count for storage
 */
export function setBrowserStorageItemsCount(
	storage: typeof localStorage,
	key: BrowserStorageType,
	value: number
): true | undefined {
	try {
		storage.setItem(browserCacheCountKey, value.toString());
		browserStorageItemsCount[key] = value;
		return true;
	} catch (err) {
		//
	}
}

/**
 * Get current count from storage
 */
export function getBrowserStorageItemsCount(
	storage: typeof localStorage
): number {
	return parseInt(storage.getItem(browserCacheCountKey) as string) || 0;
}
