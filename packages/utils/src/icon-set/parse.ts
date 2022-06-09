import type { IconifyJSON } from '@iconify/types';
import type { FullIconifyIcon } from '../icon';
import { getIconData } from './get-icon';

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
 * Extract icons from an icon set
 *
 * Returns list of icons that were found in icon set
 */
export function parseIconSet(
	data: IconifyJSON,
	callback: SplitIconSetCallback
): string[] {
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
	for (const name in icons) {
		const iconData = getIconData(data, name, true);
		if (iconData) {
			// Call callback
			callback(name, iconData);
			names.push(name);
		}
	}

	// Get aliases
	const aliases = data.aliases;
	if (aliases) {
		for (const name in aliases) {
			const iconData = icons[name] ? null : getIconData(data, name, true);
			if (iconData) {
				// Call callback
				callback(name, iconData);
				names.push(name);
			}
		}
	}

	return names;
}
