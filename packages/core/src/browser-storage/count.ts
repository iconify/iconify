import { browserCacheCountKey } from './config';

/**
 * Change current count for storage
 */
export function setBrowserStorageItemsCount(
	storage: typeof localStorage,
	value: number
): true | undefined {
	try {
		storage.setItem(browserCacheCountKey, value.toString());
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
