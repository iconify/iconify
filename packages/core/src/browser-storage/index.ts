import { addIconSet, getStorage } from '../storage/storage';
import {
	browserStorageConfig,
	browserStorageStatus,
	setBrowserStorageStatus,
} from './data';
import { iterateBrowserStorage } from './foreach';
import type { BrowserStorageType, IconStorageWithCache } from './types';

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
			const storage = getStorage(
				provider,
				prefix
			) as IconStorageWithCache;
			if (!addIconSet(storage, iconSet).length) {
				// No valid icons
				return false;
			}

			// Store lastModified, -1 if not set to get truthy value
			// Smallest of values is stored to fix cache
			const lastModified = iconSet.lastModified || -1;
			storage.lastModifiedCached = storage.lastModifiedCached
				? Math.min(storage.lastModifiedCached, lastModified)
				: lastModified;

			return true;
		});
	}

	// Check for update
}
