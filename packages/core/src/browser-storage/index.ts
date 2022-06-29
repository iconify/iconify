import { addIconSet, getStorage } from '../storage/storage';
import {
	browserStorageConfig,
	browserStorageStatus,
	setBrowserStorageStatus,
} from './data';
import { iterateBrowserStorage } from './foreach';
import type { BrowserStorageType } from './types';

/**
 * Load icons from cache
 */
export function initBrowserStorage() {
	if (browserStorageStatus) {
		return;
	}
	setBrowserStorageStatus(true);

	// Load each storage
	for (const key in browserStorageConfig) {
		iterateBrowserStorage(key as BrowserStorageType, (item) => {
			// Add icon set
			const iconSet = item.data;

			const provider = item.provider;
			const prefix = iconSet.prefix;
			const storage = getStorage(provider, prefix);
			if (!addIconSet(storage, iconSet).length) {
				// No valid icons
				return false;
			}

			return true;
		});
	}

	// Check for update
}
