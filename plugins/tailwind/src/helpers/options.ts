import type { IconCSSIconSetOptions } from '@iconify/utils/lib/css/types';
import type { IconifyJSON } from '@iconify/types';

// Callback for customising icon
type IconifyCustomiseCallback = (
	content: string,
	name: string,
	prefix: string
) => string;

// Callback for loading icon set
type IconifyJSONLoaderCallback = () => IconifyJSON;

// Source for icon set: icon set, filename, or callback that loads icon set
export type IconifyIconSetSource =
	| IconifyJSON
	| string
	| IconifyJSONLoaderCallback;

/**
 * Common options
 */
export interface CommonIconifyPluginOptions {
	// Custom icon sets
	// Value can be loaded icon set or callback that loads icon set
	iconSets?: Record<string, IconifyIconSetSource>;

	// Replace icon content
	customise?: IconifyCustomiseCallback;
}

/**
 * Options for clean class names
 */
export interface CleanIconifyPluginOptions
	extends CommonIconifyPluginOptions,
		Omit<IconCSSIconSetOptions, 'customise'> {
	//
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

/**
 * Options for reusable selectors
 */
export interface ReusableIconifyPluginOptions {
	// Selector for mask, defaults to ".iconify"
	mask?: string;

	// Selector for background, defaults to ".iconify-color"
	background?: string;

	// Variable name, defaults to "svg"
	varName?: string;
}

/**
 * Options for main plugin
 */

// Icons to include: array of names or callback
type IconsListOption = string[] | ((name: string) => boolean);

// Source filename or icon set
type IconSetSource = string | IconifyJSON;

// Full icon set options
interface IconSetOptions {
	// Prefix, required if `source` is not set
	// If both `source` and `prefix` are set, `prefix` will be used
	prefix?: string;

	// Source
	source?: IconSetSource;

	// Icons to load
	icons?: IconsListOption;
}

// Array of icon sets to load
type IconifyPluginListOptions = (string | IconSetOptions)[];

// Full object
export interface IconifyPluginOptionsObject
	extends ReusableIconifyPluginOptions {
	// Prefixes to load
	prefixes: IconifyPluginListOptions;
}

// Full options
export type IconifyPluginOptions =
	| IconifyPluginOptionsObject
	| IconifyPluginListOptions;
