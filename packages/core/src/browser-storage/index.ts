import { cache } from '../cache';
import { loadBrowserStorageCache } from './load';
import { storeInBrowserStorage } from './store';

/**
 * Init browser storage
 */
export function initBrowserStorage() {
	cache.store = storeInBrowserStorage;
	loadBrowserStorageCache();
}
