import { CacheIcons } from './interfaces/cache';
import { IconifyAPI } from './interfaces/api';

/**
 * Dynamic modules.
 *
 * Used as storage for optional functions that may or may not exist.
 * Each module must be set after including correct function for it, see build files as examples.
 */
interface Modules {
	// API module
	api?: IconifyAPI;

	// Cache module (only function that stores cache. loading cache should be done when assigning module)
	cache?: CacheIcons;
}

export const coreModules: Modules = {};
