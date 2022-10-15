import type { IconifyAliases, IconifyIcons, IconifyJSON } from '@iconify/types';
import { defaultIconDimensions } from '../icon/defaults';
import { getIconsTree } from './tree';

/**
 * Optional properties that must be copied when copying icon set
 */
export const propsToCopy = Object.keys(defaultIconDimensions).concat([
	'provider',
]) as (keyof IconifyJSON)[];

/**
 * Extract icons from icon set
 */
export function getIcons(
	data: IconifyJSON,
	names: string[],
	not_found?: boolean
): IconifyJSON | null {
	const icons = Object.create(null) as IconifyIcons;
	const aliases = Object.create(null) as IconifyAliases;
	const result: IconifyJSON = {
		prefix: data.prefix,
		icons,
	};

	const sourceIcons = data.icons;
	const sourceAliases =
		data.aliases || (Object.create(null) as IconifyAliases);

	// Add lastModified
	if (data.lastModified) {
		result.lastModified = data.lastModified;
	}

	// Get dependencies tree
	const tree = getIconsTree(data, names);
	let empty = true;

	// Copy all icons
	for (const name in tree) {
		if (!tree[name]) {
			// Failed
			if (not_found && names.indexOf(name) !== -1) {
				// Add to not_found
				(result.not_found || (result.not_found = [])).push(name);
			}
		} else if (sourceIcons[name]) {
			// Icon
			icons[name] = {
				...sourceIcons[name],
			};
			empty = false;
		} else {
			// Alias
			aliases[name] = {
				...sourceAliases[name],
			};
			result.aliases = aliases;
		}
	}

	// Copy common properties
	propsToCopy.forEach((attr) => {
		if (attr in data) {
			(result as unknown as Record<string, unknown>)[attr] = data[attr];
		}
	});

	return empty && not_found !== true ? null : result;
}
