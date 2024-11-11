import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { quicklyValidateIconSet } from '@iconify/utils/lib/icon-set/validate-basic';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon, validateIconName } from '@iconify/utils/lib/icon/name';
import { getStorage, addIconToStorage, addIconSet } from './storage';

/**
 * Interface for exported storage functions
 */
export interface IconifyStorageFunctions {
	/**
	 * Check if icon data is available
	 */
	iconLoaded: (name: string) => boolean;

	/**
	 * Older, badly named, version of iconLoaded()
	 *
	 * @deprecated
	 */
	iconExists: (name: string) => boolean;

	/**
	 * Get icon data with all properties
	 *
	 * Returns null if icon is missing (attempted to load, but failed)
	 * Returns undefined if icon was not loaded
	 */
	getIcon: (name: string) => Required<IconifyIcon> | null | undefined;

	/**
	 * List all available icons
	 */
	listIcons: (provider?: string, prefix?: string) => string[];

	/* Add icons */
	/**
	 * Add icon to storage
	 *
	 * Data is null if icon is missing
	 */
	addIcon: (name: string, data: IconifyIcon | null) => boolean;

	/**
	 * Add icon set to storage
	 */
	addCollection: (data: IconifyJSON, provider?: string) => boolean;
}

/**
 * Allow storing icons without provider or prefix, making it possible to store icons like "home"
 */
let simpleNames = false;

export function allowSimpleNames(allow?: boolean): boolean {
	if (typeof allow === 'boolean') {
		simpleNames = allow;
	}
	return simpleNames;
}

/**
 * Get icon data
 *
 * Returns:
 * - IconifyIcon on success, object directly from storage so don't modify it
 * - null if icon is marked as missing (returned in `not_found` property from API, so don't bother sending API requests)
 * - undefined if icon is missing in storage
 */
export function getIconData(
	name: string | IconifyIconName
): IconifyIcon | null | undefined {
	const icon =
		typeof name === 'string' ? stringToIcon(name, true, simpleNames) : name;

	if (icon) {
		const storage = getStorage(icon.provider, icon.prefix);
		const iconName = icon.name;
		return (
			storage.icons[iconName] ||
			(storage.missing.has(iconName) ? null : void 0)
		);
	}
}

/**
 * Add one icon
 */
export function addIcon(name: string, data: IconifyIcon | null): boolean {
	const icon = stringToIcon(name, true, simpleNames);
	if (!icon) {
		return false;
	}
	const storage = getStorage(icon.provider, icon.prefix);
	if (data) {
		return addIconToStorage(storage, icon.name, data);
	} else {
		storage.missing.add(icon.name);
		return true;
	}
}

/**
 * Add icon set
 */
export function addCollection(data: IconifyJSON, provider?: string): boolean {
	if (typeof data !== 'object') {
		return false;
	}

	// Get provider
	if (typeof provider !== 'string') {
		provider = data.provider || '';
	}

	// Check for simple names: requires empty provider and prefix
	if (simpleNames && !provider && !data.prefix) {
		// Simple names: add icons one by one
		let added = false;

		if (quicklyValidateIconSet(data)) {
			// Reset prefix
			data.prefix = '';

			parseIconSet(data, (name, icon) => {
				if (addIcon(name, icon)) {
					added = true;
				}
			});
		}
		return added;
	}

	// Validate provider and prefix
	const prefix = data.prefix;
	if (
		!validateIconName({
			provider,
			prefix,
			name: 'a',
		})
	) {
		return false;
	}

	const storage = getStorage(provider, prefix);
	return !!addIconSet(storage, data);
}

/**
 * Check if icon data is available
 */
export function iconLoaded(name: string): boolean {
	return !!getIconData(name);
}

/**
 * Get full icon
 */
export function getIcon(
	name: string
): Required<IconifyIcon> | null | undefined {
	const result = getIconData(name);
	return result
		? {
				...defaultIconProps,
				...result,
		  }
		: result;
}
