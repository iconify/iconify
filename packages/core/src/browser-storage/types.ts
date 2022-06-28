import type { IconifyJSON } from '@iconify/types';

// Storage types
export type BrowserStorageType = 'local' | 'session';

// Config
export type BrowserStorageConfig = Record<BrowserStorageType, boolean>;

// Number of items
export type BrowserStorageCount = Record<BrowserStorageType, number>;

// List of empty items, for use later
export type BrowserStorageEmptyList = Record<BrowserStorageType, number[]>;

// Stored item
export interface BrowserStorageItem {
	cached: number;
	provider: string;
	data: IconifyJSON;
}

// Status: not loaded, loading, loaded
export type BrowserStorageStatus = false | 'loading' | true;
