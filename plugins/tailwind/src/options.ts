import type { IconCSSIconSetOptions } from '@iconify/utils/lib/css/types';

/**
 * Options for locating icon sets
 */
export interface IconifyPluginFileOptions {
	// Files
	files?: Record<string, string>;
}

/**
 * Options for matching dynamic icon names
 */
export interface IconifyPluginDynamicPrefixOptions {
	// Dynamic prefix for selectors. Default is `icon`
	// Allows using icon names like `<span class="icon[mdi--home]"></span>
	// Where prefix and name are separated by '--' because Tailwind does not allow ':'
	dynamicPrefix?: string;
}

/**
 * All options
 */
export interface IconifyPluginOptions
	extends IconCSSIconSetOptions,
		IconifyPluginDynamicPrefixOptions,
		IconifyPluginFileOptions {
	//
}
