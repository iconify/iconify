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
export function getIconsTree(data: IconifyJSON): ParentIconsTree {
	const resolved = Object.create(null) as ParentIconsTree;

	// Add all icons
	for (const key in data.icons) {
		resolved[key] = [];
	}

	// Add all aliases
	const aliases = data.aliases || {};

	function resolveAlias(name: string): ParentIconsList | null {
		if (resolved[name] === void 0) {
			// Mark as failed if parent alias points to this icon to avoid infinite loop
			resolved[name] = null;

			// Get parent icon name
			const parent = aliases[name] && aliases[name].parent;

			// Get value for parent
			const value = parent && resolveAlias(parent);
			if (value) {
				resolved[name] = [parent].concat(value);
			}
		}

		return resolved[name];
	}

	for (const name in aliases) {
		resolveAlias(name);
	}

	return resolved;
}
