import type { IconCSSIconSetOptions } from '@iconify/utils/lib/css/types';

/**
 * Options for locating icon sets
 */
export interface IconifyPluginFileOptions {
	// Files
	files?: Record<string, string>;
}

/**
 * All options
 */
export interface IconifyPluginOptions
	extends IconCSSIconSetOptions,
		IconifyPluginFileOptions {
	//
}
