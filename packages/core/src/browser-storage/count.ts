import { browserCacheCountKey } from './config';
import { getStoredItem, setStoredItem } from './item';
import type { BrowserStorageInstance } from './types';

/**
 * Change current count for storage
 */
export function setBrowserStorageItemsCount(
	storage: BrowserStorageInstance,
	value: number
): true | undefined {
	return setStoredItem(storage, browserCacheCountKey, value.toString());
}

/**
 * Get current count from storage
 */
export function getBrowserStorageItemsCount(
	storage: typeof localStorage
): number {
	return (
		parseInt(getStoredItem(storage, browserCacheCountKey) as string) || 0
	);
}
