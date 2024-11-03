import { getStorage } from '../storage/storage.js';
import type { IconifyCustomLoader, IconStorageWithAPI } from './types.js';

/**
 * Set custom loader
 */
export function setCustomLoader(
	loader: IconifyCustomLoader,
	prefix: string,
	provider?: string
): void {
	// Assign loader directly to storage
	(getStorage(provider || '', prefix) as IconStorageWithAPI).customLoader =
		loader;
}
