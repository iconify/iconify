import { readFileSync } from 'fs';
import type { IconifyJSON } from '@iconify/types';

/**
 * Callback for loading icon set
 */
type IconifyJSONLoaderCallback = () => IconifyJSON;

/**
 * Options for icon set loaders
 */
export interface IconifyPluginLoaderOptions {
	// Location of icon set files. Key is icon set prefix
	files?: Record<string, string>;

	// Custom icon sets
	// Value can be loaded icon set or callback that loads icon set
	iconSets?: Record<string, IconifyJSON | IconifyJSONLoaderCallback>;
}

/**
 * Locate icon set
 */
export function locateIconSet(
	prefix: string,
	options: IconifyPluginLoaderOptions
): string | undefined {
	if (options.files?.[prefix]) {
		return options.files?.[prefix];
	}
	try {
		return require.resolve(`@iconify-json/${prefix}/icons.json`);
	} catch {}
	try {
		return require.resolve(`@iconify/json/json/${prefix}.json`);
	} catch {}
}

/**
 * Cache for loaded icon sets
 *
 * Tailwind CSS can send multiple separate requests to plugin, this will
 * prevent same data from being loaded multiple times.
 *
 * Key is filename, not prefix!
 */
const cache = Object.create(null) as Record<string, IconifyJSON>;

/**
 * Load icon set
 */
export function loadIconSet(
	prefix: string,
	options: IconifyPluginLoaderOptions
): IconifyJSON | undefined {
	// Check for custom icon set
	const customIconSet = options.iconSets?.[prefix];
	if (customIconSet) {
		if (typeof customIconSet === 'function') {
			// Callback. Store result in options to avoid loading it again
			const result = customIconSet();
			options.iconSets[prefix] = result;
			return result;
		}
		return customIconSet;
	}

	const filename = options.files?.[prefix] || locateIconSet(prefix, options);
	if (filename) {
		// Check for cache
		if (cache[filename]) {
			return cache[filename];
		}

		// Attempt to load it
		try {
			const result = JSON.parse(readFileSync(filename, 'utf8'));
			cache[filename] = result;
			return result;
		} catch {}
	}
}
