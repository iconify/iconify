import { browserStorageConfig } from './data';
import type { BrowserStorageType } from './types';

/**
 * Cache types
 */
export type IconifyBrowserCacheType = BrowserStorageType | 'all';

/**
 * Toggle cache
 */
export function toggleBrowserCache(
	storage: IconifyBrowserCacheType,
	value: boolean
): void {
	switch (storage) {
		case 'local':
		case 'session':
			browserStorageConfig[storage] = value;
			break;

		case 'all':
			for (const key in browserStorageConfig) {
				browserStorageConfig[key as BrowserStorageType] = value;
			}
			break;
	}
}

/**
 * Interface for exported functions
 */
export interface IconifyBrowserCacheFunctions {
	enableCache: (storage: IconifyBrowserCacheType) => void;
	disableCache: (storage: IconifyBrowserCacheType) => void;
}
