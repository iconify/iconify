import { browserCachePrefix } from './config';
import { getBrowserStorageItemsCount } from './count';

/**
 * Destroy old cache
 */
export function destroyBrowserStorage(storage: typeof localStorage): void {
	try {
		const total = getBrowserStorageItemsCount(storage);
		for (let i = 0; i < total; i++) {
			storage.removeItem(browserCachePrefix + i.toString());
		}
	} catch (err) {
		//
	}
}
