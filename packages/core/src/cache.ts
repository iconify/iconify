import type { IconifyJSON } from '@iconify/types';

/**
 * Function to cache loaded icons set
 */
export type CacheIcons = (provider: string, data: IconifyJSON) => void;

/**
 * Module
 */
interface CacheModule {
	store?: CacheIcons;
}

export const cache: CacheModule = {};
