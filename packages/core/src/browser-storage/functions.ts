import { browserStorageConfig } from './data';

/**
 * Cache types
 */
export type IconifyBrowserCacheType = 'local' | 'session' | 'all';

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
				browserStorageConfig[key as keyof typeof browserStorageConfig] =
					value;
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
