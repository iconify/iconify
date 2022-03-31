import type { IconifyAlias, IconifyJSON } from '@iconify/types';
import { FullIconifyIcon, iconDefaults } from '../icon';
import { getIconData } from './get-icon';

/**
 * Which aliases to parse:
 *
 * none - do not parse aliases
 * all - parse all aliases
 * variations - parse only aliases that have transformations (can be considered to be different icon)
 */
export type ParseIconSetAliases = 'none' | 'all' | 'variations';

/**
 * Callback to call for each icon.
 *
 * If data === null, icon is missing.
 */
export type SplitIconSetCallback = (
	name: string,
	data: FullIconifyIcon | null
) => void;

/**
 * Check if alias is a variation
 */
export function isVariation(item: IconifyAlias): boolean {
	for (const key in iconDefaults) {
		if (item[key as keyof typeof iconDefaults] !== void 0) {
			return true;
		}
	}
	return false;
}

export interface ParseIconSetOptions {
	aliases?: ParseIconSetAliases;
}

/**
 * Extract icons from an icon set
 *
 * Returns list of icons that were found in icon set
 */
export function parseIconSet(
	data: IconifyJSON,
	callback: SplitIconSetCallback,
	options?: ParseIconSetOptions
): string[] {
	options = options || {};

	// List of icon names
	const names: string[] = [];

	// Must be an object and must have 'icons' property
	if (typeof data !== 'object' || typeof data.icons !== 'object') {
		return names;
	}

	// Check for missing icons list returned by API
	if (data.not_found instanceof Array) {
		data.not_found.forEach((name) => {
			callback(name, null);
			names.push(name);
		});
	}

	// Get icons
	const icons = data.icons;
	Object.keys(icons).forEach((name) => {
		const iconData = getIconData(data, name, true);
		if (iconData) {
			// Call callback
			callback(name, iconData);
			names.push(name);
		}
	});

	// Get aliases
	const parseAliases = options.aliases || 'all';
	if (parseAliases !== 'none' && typeof data.aliases === 'object') {
		const aliases = data.aliases;
		Object.keys(aliases).forEach((name) => {
			if (parseAliases === 'variations' && isVariation(aliases[name])) {
				return;
			}
			const iconData = getIconData(data, name, true);
			if (iconData) {
				// Call callback
				callback(name, iconData);
				names.push(name);
			}
		});
	}

	return names;
}
