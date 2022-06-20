import type { IconifyJSON } from '@iconify/types';

// Parent icons, first is direct parent, last is icon. Does not include self
export type ParentIconsList = string[];

// Result
export type ParentIconsTree = Record<string, ParentIconsList | null>;

/**
 * Resolve icon set icons
 *
 * Returns parent icon for each icon
 */
export function getIconsTree(
	data: IconifyJSON,
	names?: string[]
): ParentIconsTree {
	const icons = data.icons;
	const aliases = data.aliases || {};

	const resolved = Object.create(null) as ParentIconsTree;

	function resolve(name: string): ParentIconsList | null {
		if (icons[name]) {
			return (resolved[name] = []);
		}

		if (resolved[name] === void 0) {
			// Mark as failed if parent alias points to this icon to avoid infinite loop
			resolved[name] = null;

			// Get parent icon name
			const parent = aliases[name] && aliases[name].parent;

			// Get value for parent
			const value = parent && resolve(parent);
			if (value) {
				resolved[name] = [parent].concat(value);
			}
		}

		return resolved[name];
	}

	// Resolve only required icons
	(names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);

	return resolved;
}
