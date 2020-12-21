import { IconifyJSON } from '@iconify/types';
import { FullIconifyIcon, IconifyIcon } from '../icon';
import { IconifyIconName, stringToIcon, validateIcon } from '../icon/name';
import { merge } from '../misc/merge';
import { getStorage, getIcon, listIcons, addIcon, addIconSet } from './storage';

/**
 * Interface for exported storage functions
 */
export interface IconifyStorageFunctions {
	/**
	 * Check if icon exists
	 */
	iconExists: (name: string) => boolean;

	/**
	 * Get icon data with all properties
	 */
	getIcon: (name: string) => Required<IconifyIcon> | null;

	/**
	 * List all available icons
	 */
	listIcons: (provider?: string, prefix?: string) => string[];

	/* Add icons */
	/**
	 * Add icon to storage
	 */
	addIcon: (name: string, data: IconifyIcon) => boolean;

	/**
	 * Add icon set to storage
	 */
	addCollection: (data: IconifyJSON, provider?: string) => boolean;
}

/**
 * Get icon name
 */
export function getIconName(name: string): IconifyIconName | null {
	const icon = stringToIcon(name);
	if (!validateIcon(icon)) {
		return null;
	}
	return icon;
}

/**
 * Get icon data
 */
export function getIconData(
	name: string | IconifyIconName
): FullIconifyIcon | null {
	const icon = typeof name === 'string' ? getIconName(name) : name;
	return icon
		? getIcon(getStorage(icon.provider, icon.prefix), icon.name)
		: null;
}

/**
 * Add icon set
 */
export function addCollection(data: IconifyJSON, provider?: string): boolean {
	if (typeof provider !== 'string') {
		provider = typeof data.provider === 'string' ? data.provider : '';
	}

	if (
		typeof data !== 'object' ||
		// Prefix must be present
		typeof data.prefix !== 'string' ||
		// Validate provider and prefix
		!validateIcon({
			provider,
			prefix: data.prefix,
			name: 'a',
		})
	) {
		return false;
	}

	const storage = getStorage(provider, data.prefix);
	return !!addIconSet(storage, data);
}

/**
 * Export
 */
export const storageFunctions: IconifyStorageFunctions = {
	// Check if icon exists
	iconExists: (name) => getIconData(name) !== null,

	// Get raw icon data
	getIcon: (name) => {
		const result = getIconData(name);
		return result ? merge(result) : null;
	},

	// List icons
	listIcons,

	// Add icon
	addIcon: (name, data) => {
		const icon = getIconName(name);
		if (!icon) {
			return false;
		}
		const storage = getStorage(icon.provider, icon.prefix);
		return addIcon(storage, icon.name, data);
	},

	// Add icon set
	addCollection,
};
