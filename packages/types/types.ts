/**
 * Icon dimensions.
 *
 * Used in:
 *  icon (as is)
 *  alias (overwrite icon's properties)
 *  root of JSON file (default values)
 */
export interface IconifyDimenisons {
	// Left position of viewBox.
	// Defaults to 0.
	left?: number;

	// Top position of viewBox.
	// Defaults to 0.
	top?: number;

	// Width of viewBox.
	// Defaults to 16.
	width?: number;

	// Height of viewBox.
	// Defaults to 16.
	height?: number;
}

/**
 * Icon transformations.
 *
 * Used in:
 *  icon (as is)
 *  alias (merged with icon's properties)
 *  root of JSON file (default values)
 */
export interface IconifyTransformations {
	// Number of 90 degrees rotations.
	// 0 = 0, 1 = 90deg and so on.
	// Defaults to 0.
	// When merged (such as alias + icon), result is icon.rotation + alias.rotation.
	rotate?: number;

	// Horizontal flip.
	// Defaults to false.
	// When merged, result is icon.hFlip !== alias.hFlip
	hFlip?: boolean;

	// Vertical flip. (see hFlip comments)
	vFlip?: boolean;
}

/**
 * Combination of dimensions and transformations.
 */
export interface IconifyOptional
	extends IconifyDimenisons,
		IconifyTransformations {}

/**
 * Alias.
 */
export interface IconifyAlias extends IconifyOptional {
	// Parent icon index without prefix, required.
	parent: string;

	// IconifyOptional properties.
	// Alias should have only properties that it overrides.
	// Transformations are merged, not overridden. See IconifyTransformations comments.
}

/**
 * Icon.
 */
export interface IconifyIcon extends IconifyOptional {
	// Icon body: <path d="..." />, required.
	body: string;

	// IconifyOptional properties.
	// If property is missing in JSON file, look in root object for default value.
}

/**
 * "icons" field of JSON file.
 */
export interface IconifyIcons {
	// Index is name of icon, without prefix. Value is IconifyIcon object.
	[index: string]: IconifyIcon;
}

/**
 * "aliases" field of JSON file.
 */
export interface IconifyAliases {
	// Index is name of icon, without prefix. Value is IconifyAlias object.
	[index: string]: IconifyAlias;
}

/**
 * Icon set information block.
 */
export interface IconifyInfo {
	// Icon set name.
	name: string;

	// Total number of icons.
	total?: number;

	// Version string.
	version?: string;

	// Author information.
	author: {
		// Author name.
		name: string;

		// Link to author's website or icon set website.
		url?: string;
	};

	// License
	license: {
		// Human readable license.
		title: string;

		// SPDX license identifier.
		spdx?: string;

		// License URL.
		url?: string;
	};

	// Array of icons that should be used for samples in icons list.
	samples: string[];

	// Icon grid: number or array of numbers.
	height?: number | number[];

	// Display height for samples: 16 - 24
	displayHeight?: number;

	// Category on Iconify collections list.
	category?: string;

	// Palette status. True if icons have predefined color scheme, false if icons use currentColor.
	// Icon set should not mix icons with and without palette to simplify search.
	palette: boolean;
}

/**
 * Optional themes.
 */
export interface IconifyThemes {
	// Key is unique string.
	[index: string]: {
		// Theme title.
		title: string;

		// Icon prefix or suffix, including dash. All icons that start with prefix and end with suffix belong to theme.
		prefix?: string; // Example: 'baseline-'
		suffix?: string; // Example: '-filled'
	};
}

/**
 * Characters used in font.
 */
export interface IconifyChars {
	// Index is character, such as "f000".
	// Value is icon name.
	[index: string]: string;
}

/**
 * Icon categories
 */
export interface IconifyCategories {
	// Index is category title, such as "Weather".
	// Value is array of icons that belong to that category.
	// Each icon can belong to multiple categories or no categories.
	[index: string]: string[];
}

/**
 * Meta data stored in JSON file, used for browsing icon set.
 */
export interface IconifyMetaData {
	// Icon set information block. Used for public icon sets, can be skipped for private icon sets.
	info?: IconifyInfo;

	// Characters used in font. Used for searching by character for icon sets imported from font, exporting icon set to font.
	chars?: IconifyChars;

	// Categories. Used for filtering icons.
	categories?: IconifyCategories;

	// Optional themes.
	themes?: IconifyThemes;
}

/**
 * JSON structure.
 *
 * All optional values can exist in root of JSON file, used as defaults.
 */
export interface IconifyJSON extends IconifyOptional, IconifyMetaData {
	// Prefix for icons in JSON file, required.
	prefix: string;

	// API provider, optional.
	provider?: string;

	// List of icons, required.
	icons: IconifyIcons;

	// Optional aliases.
	aliases?: IconifyAliases;

	// Optional list of missing icons. Returned by Iconify API when querying for icons that do not exist.
	not_found?: string[];

	// IconifyOptional properties that are used as default values for icons when icon is missing value.
	// If property exists in both icon and root, use value from icon.
	// This is used to reduce duplication.
}
