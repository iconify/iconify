import type { IconifyJSON } from '@iconify/types';
import type { IconStorage } from '../storage/storage';

// Storage types
export type BrowserStorageType = 'local' | 'session';

// localStorage
export type BrowserStorageInstance = typeof localStorage;

// Config
export type BrowserStorageConfig = Record<BrowserStorageType, boolean>;

// List of empty items, for re-use
export type BrowserStorageEmptyList = Record<BrowserStorageType, Set<number>>;

// Stored item
export interface BrowserStorageItem {
	cached: number;
	provider: string;
	data: IconifyJSON;
}

/**
 * Add custom stuff to storage
 */
export interface IconStorageWithCache extends IconStorage {
	// Last modified from browser cache, minimum of available values
	// If not set, but icons are cached, value is -1
	lastModifiedCached?: number;
}
