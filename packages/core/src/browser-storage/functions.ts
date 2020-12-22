import { config } from './index';

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
			config[storage] = value;
			break;

		case 'all':
			for (const key in config) {
				config[key as keyof typeof config] = value;
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
