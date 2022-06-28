import type { IconifyJSON } from '@iconify/types';

// Mixin for config for various types
export interface BrowserStorageType<T> {
	local: T;
	session: T;
}

// Config
export type BrowserStorageConfig = BrowserStorageType<boolean>;

// Number of items
export type BrowserStorageCount = BrowserStorageType<number>;

// List of empty items, for use later
export type BrowserStorageEmptyList = BrowserStorageType<number[]>;

// Stored item
export interface BrowserStorageItem {
	cached: number;
	provider: string;
	data: IconifyJSON;
}
