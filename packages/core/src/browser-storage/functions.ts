/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BrowserStorageType } from './types.js';

/**
 * Cache types
 *
 * @deprecated This type is not used anymore
 */
export type IconifyBrowserCacheType = BrowserStorageType | 'all';

/**
 * Toggle cache
 *
 * @deprecated This function is not used anymore
 */
export function toggleBrowserCache(
	storage: IconifyBrowserCacheType,
	value: boolean
): void {
	// Not used
}

/**
 * Interface for exported functions
 *
 * @deprecated This type is not used anymore
 */
export interface IconifyBrowserCacheFunctions {
	enableCache: (storage: IconifyBrowserCacheType) => void;
	disableCache: (storage: IconifyBrowserCacheType) => void;
}
