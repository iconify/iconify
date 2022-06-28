import { browserCacheCountKey } from './config';
import { browserStorageItemsCount } from './data';
import type { BrowserStorageConfig } from './types';

/**
 * Change current count for storage
 */
export function setBrowserStorageItemsCount(
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
 */
export function getBrowserStorageItemsCount(
	storage: typeof localStorage
): number {
	const count = storage.getItem(browserCacheCountKey);
	if (count) {
		const total = parseInt(count);
		return total ? total : 0;
	}
	return 0;
}
