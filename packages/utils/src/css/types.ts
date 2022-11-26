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
		IconCSSSelectorOptions,
		Required<IconCSSModeOptions> {
	//
}

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

/**
 * Options for generating data for one icon
 */
export interface IconCSSIconOptions
	extends IconCSSSharedOptions,
		IconCSSIconSelectorOptions,
		IconCSSModeOptions,
		IconCSSFormatOptions {
	//
}

/**
 * Options for generating multiple icons
 */
export interface IconCSSIconSetOptions
	extends IconCSSSharedOptions,
		IconCSSSelectorOptions,
		IconCSSModeOptions,
		IconCSSFormatOptions {
	//
}
