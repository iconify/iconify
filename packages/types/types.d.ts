/**
 * Icon dimensions.
 *
 * Defines the viewBox dimensions for SVG icons. These properties can be used in:
 * - Icon definitions (applied directly)
 * - Alias definitions (overrides parent icon's properties)
 * - Root of JSON file (provides default values for all icons)
 */
export interface IconifyDimenisons
{
	/**
	 * Left position of the viewBox.
	 * @default 0
	 */
	left?: number;

	/**
	 * Top position of the viewBox.
	 * @default 0
	 */
	top?: number;

	/**
	 * Width of the viewBox.
	 * @default 16
	 */
	width?: number;

	/**
	 * Height of the viewBox.
	 * @default 16
	 */
	height?: number;
}

/**
 * Icon transformations interface.
 *
 * Defines visual transformations that can be applied to icons. Used in:
 * - Icon definitions (applied directly)
 * - Alias definitions (merged with parent icon's properties)
 */
export interface IconifyTransformations
{
	/**
	 * Number of 90-degree rotations to apply.
	 * - 0 = 0°
	 * - 1 = 90°
	 * - 2 = 180°
	 * - 3 = 270°
	 *
	 * When merging (e.g., alias + icon), the result is `icon.rotate + alias.rotate`.
	 * @default 0
	 */
	rotate?: number;

	/**
	 * Horizontal flip transformation.
	 * When merging (e.g., alias + icon), the result is `icon.hFlip !== alias.hFlip`.
	 * @default false
	 */
	hFlip?: boolean;

	/**
	 * Vertical flip transformation.
	 * When merging (e.g., alias + icon), the result is `icon.vFlip !== alias.vFlip`.
	 * @default false
	 */
	vFlip?: boolean;
}

/**
 * Combination of dimensions and transformations.
 */
export interface IconifyOptional
	extends IconifyDimenisons,
		IconifyTransformations
{

}

/**
 * Icon alias definition.
 */
export interface IconifyAlias extends IconifyOptional
{
	/**
	 * Parent icon name without prefix.
	 */
	parent: string;

	/*
	 * Optional properties from IconifyOptional can be used to override
	 * the parent icon's properties. Transformations are merged rather than overridden.
	 * @see IconifyTransformations for transformation merging behavior
	 */
}

/**
 * Icon definition.
 *
 * Represents a complete icon with its SVG body content and optional properties.
 * If any optional property is missing, the default value from the root JSON object is used.
 */
export interface IconifyIcon extends IconifyOptional
{
	/**
	 * SVG body content (inner SVG elements).
	 * @example `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
	 */
	body: string;

	/*
	 * Optional properties from IconifyOptional can be used to define
	 * the icon's dimensions and transformations. If missing, values from
	 * the root JSON object are used as defaults.
	 */
}

/**
 * API-specific icon attributes.
 *
 * Additional properties provided by the Iconify API that affect icon discovery and search behavior.
 * These attributes are not part of the core icon definition but are used for API functionality.
 */
interface APIIconAttributes
{
	/**
	 * Indicates if the icon is hidden from search results.
	 *
	 * Hidden icons are kept in icon sets for backward compatibility when icons are deprecated
	 * or removed, preventing websites from breaking when referencing removed icons.
	 */
	hidden?: boolean;
}

/**
 * Extended icon definition with API attributes.
 */
export interface ExtendedIconifyIcon extends IconifyIcon, APIIconAttributes { }

/**
 * Extended alias definition with API attributes.
 */
export interface ExtendedIconifyAlias extends IconifyAlias, APIIconAttributes { }

/**
 * Collection of icons in an icon set.
 *
 * Maps icon names (without prefix) to their definitions.
 */
export interface IconifyIcons
{
	/**
	 * Icon definitions indexed by name.
	 * @example `{ "home": { body: "<path d='...'/>" }, "user": { body: "<circle cx='12' cy='7' r='4'/>" } }`
	 */
	[index: string]: ExtendedIconifyIcon;
}

/**
 * Collection of icon aliases in an icon set.
 *
 * Maps alias names (without prefix) to their definitions.
 */
export interface IconifyAliases
{
	/**
	 * Alias definitions indexed by name without prefix.
	 */
	[iconName: string]: ExtendedIconifyAlias;
}

/**
 * Icon set information and metadata.
 */
export interface IconifyInfo
{
	/**
	 * Name of the icon set.
	 */
	name: string;

	/**
	 * Total number of icons in the set.
	 */
	total?: number;

	/**
	 * Version string of the icon set.
	 */
	version?: string;

	/**
	 * Author information.
	 */
	author:
	{
		/**
		 * Author name.
		 */
		name: string;

		/**
		 * URL to author's website or icon set homepage.
		 */
		url?: string;
	};

	/**
	 * Licensing information.
	 */
	license:
	{
		/**
		 * Human-readable license name.
		 * @example "Apache License 2.0"
		 */
		title: string;

		/**
		 * SPDX license identifier.
		 * @example "Apache-2.0"
		 * @see https://spdx.org/licenses/
		 */
		spdx?: string;

		/**
		 * URL to the full license text.
		 * @example "https://www.apache.org/licenses/LICENSE-2.0"
		 */
		url?: string;
	};

	/**
	 * Array of icon names to use as samples in icon set listings.
	 */
	samples?: string[];

	/**
	 * Icon grid configuration for display purposes.
	 */
	height?: number | number[];

	/**
	 * Display height for icon samples in pixels.
	 * Should be between 16-24 pixels for optimal display in icon browsers.
	 * @minimum 16
	 * @maximum 24
	 */
	displayHeight?: number;

	/**
	 * Category classification for the Iconify collections list.
	 */
	category?: string;

	/**
	 * Tags for grouping and filtering similar icon sets.
	 */
	tags?: string[];

	/**
	 * Indicates whether icons have a predefined color scheme.
	 *
	 * - `true`: Icons have predefined colors and should not use currentColor
	 * - `false`: Icons use currentColor and inherit text color
	 *
	 * Icon sets should avoid mixing both types for consistent search experience.
	 */
	palette?: boolean;

	/**
	 * If true, the icon set will not appear in public icon set listings.
	 * Used for private or deprecated icon sets.
	 * @default false
	 */
	hidden?: boolean;
}

/**
 * Legacy icon themes configuration (deprecated).
 *
 * @deprecated This format is unnecessarily complicated as the key is meaningless
 * and suffixes/prefixes are mixed together. Use the newer `prefixes` and `suffixes`
 * format in IconifyMetaData instead.
 */
export interface LegacyIconifyThemes
{
	/**
	 * Theme definitions indexed by unique identifier.
	 * The key is an arbitrary unique string.
	 */
	[key: string]:
	{
		/**
		 * Display title for the theme.
		 */
		title: string;

		/**
		 * Icon name prefix including dash.
		 * All icons starting with this prefix belong to the theme.
		 * @example "baseline-"
		 */
		prefix?: string;

		/**
		 * Icon name suffix including dash.
		 * All icons ending with this suffix belong to the theme.
		 * @example "-filled"
		 */
		suffix?: string;
	};
}

/**
 * Character-to-icon mapping for font-based icon sets.
 *
 * Maps Unicode character codes to icon names, used for:
 * - Searching icons by character in font-imported icon sets
 * - Exporting icon sets to font format
 */
export interface IconifyChars
{
	/**
	 * Character mappings indexed by Unicode character code.
	 * @example `{ "f000": "home", "f001": "user" }`
	 */
	[character: string]: string;
}

/**
 * Icon categorization system.
 *
 * Groups icons into categories for easier browsing and filtering.
 * Icons can belong to multiple categories or no categories at all.
 */
export interface IconifyCategories
{
	/**
	 * Category definitions indexed by category name.
	 * Each icon can belong to multiple categories or no categories at all.
	 */
	[category: string]: string[];
}

/**
 * Metadata for icon set browsing and organization.
 */
export interface IconifyMetaData
{
	/**
	 * Icon set information block.
	 * Used for public icon sets; can be omitted for private icon sets.
	 */
	info?: IconifyInfo;

	/**
	 * Character-to-icon mappings for font-based icon sets.
	 * Used for character-based searching and font export functionality.
	 */
	chars?: IconifyChars;

	/**
	 * Icon categorization for filtering and browsing.
	 */
	categories?: IconifyCategories;

	/**
	 * Legacy theme definitions (deprecated).
	 * @deprecated Use `prefixes` and `suffixes` instead.
	 */
	themes?: LegacyIconifyThemes;

	/**
	 * Theme prefixes mapping.
	 * Maps icon name prefixes to theme titles.
	 */
	prefixes?: Record<string, string>;

	/**
	 * Theme suffixes mapping.
	 * Maps icon name suffixes to theme titles.
	 */
	suffixes?: Record<string, string>;
}

/**
 * Core icon data structure without metadata.
 *
 * Contains only the essential icon data needed for rendering icons,
 * excluding browsing and organizational metadata.
 */
export interface IconifyJSONIconsData extends IconifyDimenisons
{
	/**
	 * Unique prefix for all icons in this set.
	 */
	prefix: string;

	/**
	 * API provider identifier.
	 * Specifies which API provider serves this icon set.
	 */
	provider?: string;

	/**
	 * Collection of icon definitions.
	 */
	icons: IconifyIcons;

	/**
	 * Collection of icon aliases.
	 * Optional aliases that reference existing icons with modifications.
	 */
	aliases?: IconifyAliases;

	/*
	 * Default viewBox dimensions inherited from IconifyDimenisons.
	 *
	 * These properties serve as fallback values for icons that don't
	 * specify their own dimensions. Individual icon dimensions take precedence
	 * when specified. This reduces duplication in icon definitions.
	 */
}

/**
 * Complete icon set JSON structure.
 *
 * Combines icon data with metadata to provide a comprehensive icon set definition.
 * All optional values can exist in the root of the JSON file as defaults for individual icons.
 */
export interface IconifyJSON extends IconifyJSONIconsData, IconifyMetaData
{
	/**
	 * Last modification timestamp for icon data.
	 *
	 * Unix timestamp in seconds indicating when the icon data was last updated.
	 * Only reflects changes to icon data, not metadata. Used by components
	 * to invalidate cached icons when the data changes.
	 */
	lastModified?: number;

	/**
	 * List of icon names that were requested but don't exist.
	 *
	 * Returned by the Iconify API when querying for non-existent icons
	 * to help identify missing or misnamed icons.
	 */
	not_found?: string[];
}

/**
 * Structure of '@iconify-json/*' package exports.
 *
 * Individual icon set packages split the JSON structure into separate files
 * to reduce the amount of data imported when only specific parts are needed.
 * This allows tree-shaking and more efficient bundle sizes.
 */
export interface IconifyJSONPackageExports
{
	/**
	 * Icon set information and metadata.
	 */
	info: IconifyInfo;

	/**
	 * Complete icon set data including icons and aliases.
	 */
	icons: IconifyJSON;

	/**
	 * Additional metadata for browsing and organization.
	 */
	metadata: IconifyMetaData;

	/**
	 * Character-to-icon mappings for font-based icon sets.
	 */
	chars: IconifyChars;
}
