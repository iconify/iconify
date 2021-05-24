import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { parseIconSet } from '../icon/icon-set';
import type { IconifyIconName } from '../icon/name';
import { stringToIcon, validateIcon } from '../icon/name';
import {
	getStorage,
	getIcon,
	listIcons,
	addIcon as storeIcon,
	addIconSet,
} from './storage';
// import { parseIconSet } from '../icon';

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
 */
export function getIconData(
	name: string | IconifyIconName
): FullIconifyIcon | null {
	const icon =
		typeof name === 'string' ? stringToIcon(name, true, simpleNames) : name;
	return icon
		? getIcon(getStorage(icon.provider, icon.prefix), icon.name)
		: null;
}

/**
 * Add one icon
 */
export function addIcon(name: string, data: IconifyIcon): boolean {
	const icon = stringToIcon(name, true, simpleNames);
	if (!icon) {
		return false;
	}
	const storage = getStorage(icon.provider, icon.prefix);
	return storeIcon(storage, icon.name, data);
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
		provider = typeof data.provider === 'string' ? data.provider : '';
	}

	// Check for simple names: requires empty provider and prefix
	if (
		simpleNames &&
		provider === '' &&
		(typeof data.prefix !== 'string' || data.prefix === '')
	) {
		// Simple names: add icons one by one
		let added = false;
		parseIconSet(data, (name, icon) => {
			if (icon !== null && addIcon(name, icon)) {
				added = true;
			}
		});
		return added;
	}

	// Validate provider and prefix
	if (
		typeof data.prefix !== 'string' ||
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
		return result ? { ...result } : null;
	},

	// List icons
	listIcons,

	// Add icon
	addIcon,

	// Add icon set
	addCollection,
};
