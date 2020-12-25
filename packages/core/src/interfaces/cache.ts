import type { IconifyJSON } from '@iconify/types';

/**
 * Function to cache loaded icons set
 */
export type CacheIcons = (provider: string, data: IconifyJSON) => void;

/**
 * Function to load icons from cache
 */
export type LoadIconsCache = () => void;
