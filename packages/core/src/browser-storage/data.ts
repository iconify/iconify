import type { BrowserStorageConfig, BrowserStorageEmptyList } from './types';

/**
 * Storage configuration
 */
export const browserStorageConfig: BrowserStorageConfig = {
	local: true,
	session: true,
};

/**
 * List of empty items
 */
export const browserStorageEmptyItems: BrowserStorageEmptyList = {
	local: new Set(),
	session: new Set(),
};

/**
 * Flag to check if storage has been loaded
 */
export let browserStorageStatus = false;

export function setBrowserStorageStatus(status: boolean) {
	browserStorageStatus = status;
}
