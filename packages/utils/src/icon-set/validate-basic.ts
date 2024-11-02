import type { IconifyAliases, IconifyJSON } from '@iconify/types';
import {
	defaultIconDimensions,
	defaultExtendedIconProps,
} from '../icon/defaults';

type PropsList = Record<string, unknown>;

/**
 * Optional properties
 */
const optionalPropertyDefaults = {
	provider: '',
	aliases: {},
	not_found: {},
	...defaultIconDimensions,
} as PropsList;

/**
 * Check props
 */
function checkOptionalProps(item: PropsList, defaults: PropsList): boolean {
	for (const prop in defaults) {
		if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
			return false;
		}
	}
	return true;
}

/**
 * Validate icon set, return it as IconifyJSON on success, null on failure
 *
 * Unlike validateIconSet(), this function is very basic.
 * It does not throw exceptions, it does not check metadata, it does not fix stuff.
 */
export function quicklyValidateIconSet(obj: unknown): IconifyJSON | null {
	// Check for object with 'icons' nested object
	if (typeof obj !== 'object' || obj === null) {
		return null;
	}

	// Convert type
	const data = obj as IconifyJSON;

	// Check for prefix and icons
	if (
		typeof data.prefix !== 'string' ||
		!(obj as Record<string, unknown>).icons ||
		typeof (obj as Record<string, unknown>).icons !== 'object'
	) {
		return null;
	}

	// Check for optional properties
	if (!checkOptionalProps(obj as PropsList, optionalPropertyDefaults)) {
		return null;
	}

	// Check all icons
	const icons = data.icons;
	for (const name in icons) {
		const icon = icons[name];
		if (
			// Name cannot be empty
			!name ||
			// Must have body
			typeof icon.body !== 'string' ||
			// Check other props
			!checkOptionalProps(
				icon as unknown as PropsList,
				defaultExtendedIconProps
			)
		) {
			return null;
		}
	}

	// Check all aliases
	const aliases = data.aliases || (Object.create(null) as IconifyAliases);
	for (const name in aliases) {
		const icon = aliases[name];
		const parent = icon.parent;
		if (
			// Name cannot be empty
			!name ||
			// Parent must be set and point to existing icon
			typeof parent !== 'string' ||
			(!icons[parent] && !aliases[parent]) ||
			// Check other props
			!checkOptionalProps(
				icon as unknown as PropsList,
				defaultExtendedIconProps
			)
		) {
			return null;
		}
	}

	return data;
}
