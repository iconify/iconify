/*
 *
 * Options for rendering icons as mask or background
 *
 */

/**
 * Icon mode
 */
export type IconCSSMode = 'mask' | 'background';

/**
 * Selector for icon
 */
export interface IconCSSIconSelectorOptions {
	// True if selector is a pseudo-selector
	pseudoSelector?: boolean;

	// Selector used for icon
	iconSelector?: string;
}

/**
 * Selector for icon when generating data from icon set
 */
export interface IconCSSSelectorOptions extends IconCSSIconSelectorOptions {
	// `iconSelector` is inherited from parent interface.
	// Can contain {name} for icon name.
	// If not set, other options from this interface are ignored

	// Selector used for common elements
	// Used only when set
	commonSelector?: string;

	// Selector for rules in icon that override common rules. Can contain {name} for icon name
	// Used only when both `commonSelector` and `overrideSelector` are set
	overrideSelector?: string;
}

/**
 * Options common for both multiple icons and single icon
 */
export interface IconCSSSharedOptions {
	// Variable name, null to disable
	varName?: string | null;

	// If true, result will always be square item
	forceSquare?: boolean;

	// Set color for monotone icons
	color?: string;

	// Custom rules
	rules?: Record<string, string>;
}

/**
 * Mode
 */
export interface IconCSSModeOptions {
	mode?: IconCSSMode;
}

/**
 * Options for generating common code
 *
 * Requires mode
 */
export interface IconCSSCommonCodeOptions
	extends IconCSSSharedOptions,
		IconCSSIconSelectorOptions,
		Required<IconCSSModeOptions> {
	//
}

/**
 * Options for generating data for one icon
 */
export interface IconCSSItemOptions
	extends IconCSSSharedOptions,
		Required<IconCSSModeOptions> {
	//
}

/*
 *
 * Options for rendering icons as content
 *
 */

/**
 * Selector for icon
 */
export interface IconContentIconSelectorOptions {
	// Selector used for icon
	iconSelector?: string;
}

/**
 * Options common for both multiple icons and single icon
 */
export interface IconContentSharedOptions {
	// Icon height
	height: number;

	// Icon width. If not set, it will be calculated using icon's width/height ratio
	width?: number;

	// Set color for monotone icons
	color?: string;

	// Custom rules
	rules?: Record<string, string>;
}

/**
 * Options for generating data for one icon
 */
export type IconContentItemOptions = IconContentSharedOptions;

/*
 *
 * Options for formatting CSS
 *
 */

/**
 * Formatting modes. Same as in SASS
 */
export type CSSFormatMode = 'expanded' | 'compact' | 'compressed';

/**
 * Item to format
 */
export interface CSSUnformattedItem {
	selector: string | string[];
	rules: Record<string, string>;
}

/**
 * Formatting options
 */
export interface IconCSSFormatOptions {
	// Formatter
	format?: CSSFormatMode;
}

/*
 *
 * Combined options for functions that render and format code
 *
 */

/**
 * Options for generating data for one icon as background/mask
 */
export interface IconCSSIconOptions
	extends IconCSSSharedOptions,
		IconCSSIconSelectorOptions,
		IconCSSModeOptions,
		IconCSSFormatOptions {
	// Customise icon
	customise?: (content: string) => string;
}

/**
 * Options for generating data for one icon as content
 */
export interface IconContentIconOptions
	extends IconContentSharedOptions,
		IconContentIconSelectorOptions,
		IconCSSFormatOptions {
	// Customise icon
	customise?: (content: string) => string;
}

/**
 * Options for generating multiple icons as background/mask
 */
export interface IconCSSIconSetOptions
	extends IconCSSSharedOptions,
		IconCSSSelectorOptions,
		IconCSSModeOptions,
		IconCSSFormatOptions {
	// Customise icon from icon set
	customise?: (content: string, name: string) => string;
}

/**
 * Options for generating multiple icons as content
 */
export interface IconContentIconSetOptions
	extends IconContentSharedOptions,
		IconContentIconSelectorOptions,
		IconCSSFormatOptions {
	// Customise icon from icon set
	customise?: (content: string, name: string) => string;
}
