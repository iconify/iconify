import type { IconifyJSON } from '@iconify/types';
import type { FullExtendedIconifyIcon } from '../icon/defaults';
import { internalGetIconData } from './get-icon';
import { getIconsTree } from './tree';

/**
 * Callback to call for each icon.
 *
 * If data === null, icon is missing.
 */
export type SplitIconSetCallback = (
	name: string,
	data: FullExtendedIconifyIcon | null
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

	// Get tree
	const tree = getIconsTree(data);
	for (const name in tree) {
		const item = tree[name];
		if (item) {
			callback(name, internalGetIconData(data, name, item, true));
			names.push(name);
		}
	}

	return names;
}
