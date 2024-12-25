import type { IconifyJSON } from '@iconify/types';

// Source for icon set: icon set, filename, or synchronous callback that loads icon set
export type IconifyIconSetSource = IconifyJSON | string | (() => IconifyJSON);

/**
 * Common options
 */
export interface CommonIconifyPluginOptions {
	// Custom icon sets
	// Value can be loaded icon set or callback that loads icon set
	iconSets?: Record<string, IconifyIconSetSource>;

	// Replace icon content
	customise?: (content: string, name: string, prefix: string) => string;
}

/**
 * Options for dynamic class names
 */
export interface DynamicIconifyPluginOptions
	extends CommonIconifyPluginOptions {
	// Class prefix
	prefix?: string;

	// Include icon-specific selectors only
	overrideOnly?: true;

	// Sets the default height/width value (ex. scale: 2 = 2em)
	scale?: number;
}
