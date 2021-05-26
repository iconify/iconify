import type {
	IconifyJSON,
	IconifyIcon,
	IconifyOptional,
	IconifyAlias,
	IconifyIcons,
	IconifyAliases,
} from '@iconify/types';
import type { FullIconifyIcon } from '../icon';
import { iconDefaults } from '../icon';
import { mergeIconData } from '../icon/merge';

/**
 * What to track when adding icon set:
 *
 * none - do not track anything, return true on success
 * added - track added icons, return list of added icons on success
 * all - track added and missing icons, return full list on success
 */
export type AddIconSetTracking = 'none' | 'added' | 'all';

/**
 * Callback to add icon to storage.
 *
 * If data === null, icon is missing.
 */
export type SplitIconSetCallback = (
	name: string,
	data: FullIconifyIcon | null
) => void;

/**
 * Get list of defaults keys
 */
const defaultsKeys = Object.keys(iconDefaults) as (keyof IconifyOptional)[];

/**
 * Resolve alias
 */
function resolveAlias(
	alias: IconifyAlias,
	icons: IconifyIcons,
	aliases: IconifyAliases,
	level = 0
): IconifyIcon | null {
	const parent = alias.parent;
	if (icons[parent] !== void 0) {
		return mergeIconData(icons[parent], alias);
	}
	if (aliases[parent] !== void 0) {
		if (level > 2) {
			// icon + alias + alias + alias = too much nesting, possibly infinite
			return null;
		}
		const icon = resolveAlias(aliases[parent], icons, aliases, level + 1);
		if (icon) {
			return mergeIconData(icon, alias);
		}
	}

	return null;
}

/**
 * Extract icons from an icon set
 */
export function parseIconSet(
	data: IconifyJSON,
	callback: SplitIconSetCallback,
	list: AddIconSetTracking = 'none'
): boolean | string[] {
	const added: string[] = [];

	// Must be an object
	if (typeof data !== 'object') {
		return list === 'none' ? false : added;
	}

	// Check for missing icons list returned by API
	if (data.not_found instanceof Array) {
		data.not_found.forEach((name) => {
			callback(name, null);
			if (list === 'all') {
				added.push(name);
			}
		});
	}

	// Must have 'icons' object
	if (typeof data.icons !== 'object') {
		return list === 'none' ? false : added;
	}

	// Get default values
	const defaults = Object.create(null);
	defaultsKeys.forEach((key) => {
		if (data[key] !== void 0 && typeof data[key] !== 'object') {
			defaults[key] = data[key];
		}
	});

	// Get icons
	const icons = data.icons;
	Object.keys(icons).forEach((name) => {
		const icon = icons[name];
		if (typeof icon.body !== 'string') {
			return;
		}

		// Freeze icon to make sure it will not be modified
		callback(
			name,
			Object.freeze({ ...iconDefaults, ...defaults, ...icon })
		);
		added.push(name);
	});

	// Get aliases
	if (typeof data.aliases === 'object') {
		const aliases = data.aliases;
		Object.keys(aliases).forEach((name) => {
			const icon = resolveAlias(aliases[name], icons, aliases, 1);
			if (icon) {
				// Freeze icon to make sure it will not be modified
				callback(
					name,
					Object.freeze({ ...iconDefaults, ...defaults, ...icon })
				);
				added.push(name);
			}
		});
	}

	return list === 'none' ? added.length > 0 : added;
}
