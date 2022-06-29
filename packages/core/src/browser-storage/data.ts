import type {
	BrowserStorageConfig,
	BrowserStorageCount,
	BrowserStorageEmptyList,
} from './types';

/**
 * Storage configuration
 */
export const browserStorageConfig: BrowserStorageConfig = {
	local: true,
	session: true,
};

/**
 * Items counter
 */
export const browserStorageItemsCount: BrowserStorageCount = {
	local: 0,
	session: 0,
};

/**
 * List of empty items
 */
export const browserStorageEmptyItems: BrowserStorageEmptyList = {
	local: [],
	session: [],
};

/**
 * Flag to check if storage has been loaded
 */
export let browserStorageStatus = false;

export function setBrowserStorageStatus(status: boolean) {
	browserStorageStatus = status;
}
