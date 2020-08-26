import {
	IconifyJSON,
	IconifyIcon,
	IconifyOptional,
	IconifyIcons,
	IconifyAliases,
	IconifyAlias,
} from '@iconify/types';
import { FullIconifyIcon, iconDefaults, fullIcon } from '../icon';
import { mergeIcons } from '../icon/merge';
import { merge } from '../misc/merge';

/**
 * Get list of defaults keys
 */
const defaultsKeys = Object.keys(iconDefaults) as (keyof IconifyOptional)[];

/**
 * List of icons
 */
type IconRecords = Record<string, FullIconifyIcon | null>;

/**
 * Storage type
 */
export interface IconStorage {
	provider: string;
	prefix: string;
	icons: IconRecords;
	missing: Record<string, number>;
}

/**
 * Storage by provider and prefix
 */
const storage: Record<string, Record<string, IconStorage>> = Object.create(
	null
);

/**
 * Create new storage
 */
export function newStorage(provider: string, prefix: string): IconStorage {
	return {
		provider,
		prefix,
		icons: Object.create(null),
		missing: Object.create(null),
	};
}

/**
 * Get storage for provider and prefix
 */
export function getStorage(provider: string, prefix: string): IconStorage {
	if (storage[provider] === void 0) {
		storage[provider] = Object.create(null);
	}
	const providerStorage = storage[provider];
	if (providerStorage[prefix] === void 0) {
		providerStorage[prefix] = newStorage(provider, prefix);
	}
	return providerStorage[prefix];
}

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
		return mergeIcons(icons[parent], (alias as unknown) as IconifyIcon);
	}
	if (aliases[parent] !== void 0) {
		if (level > 2) {
			// icon + alias + alias + alias = too much nesting, possibly infinite
			throw new Error('Invalid alias');
		}
		const icon = resolveAlias(aliases[parent], icons, aliases, level + 1);
		if (icon) {
			return mergeIcons(icon, (alias as unknown) as IconifyIcon);
		}
	}

	return null;
}

/**
 * What to track when adding icon set:
 *
 * none - do not track anything, return true on success
 * added - track added icons, return list of added icons on success
 * all - track added and missing icons, return full list on success
 */
export type AddIconSetTracking = 'none' | 'added' | 'all';

/**
 * Add icon set to storage
 *
 * Returns array of added icons if 'list' is true and icons were added successfully
 */
export function addIconSet(
	storage: IconStorage,
	data: IconifyJSON,
	list: AddIconSetTracking = 'none'
): boolean | string[] {
	const added: string[] = [];

	try {
		// Must be an object
		if (typeof data !== 'object') {
			return false;
		}

		// Check for missing icons list returned by API
		if (data.not_found instanceof Array) {
			const t = Date.now();
			data.not_found.forEach((name) => {
				storage.missing[name] = t;
				if (list === 'all') {
					added.push(name);
				}
			});
		}

		// Must have 'icons' object
		if (typeof data.icons !== 'object') {
			return false;
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
				throw new Error('Invalid icon');
			}

			// Freeze icon to make sure it will not be modified
			storage.icons[name] = Object.freeze(
				merge(iconDefaults, defaults, icon)
			);
			if (list !== 'none') {
				added.push(name);
			}
		});

		// Get aliases
		if (typeof data.aliases === 'object') {
			const aliases = data.aliases;
			Object.keys(aliases).forEach((name) => {
				const icon = resolveAlias(aliases[name], icons, aliases, 1);
				if (icon) {
					// Freeze icon to make sure it will not be modified
					storage.icons[name] = Object.freeze(
						merge(iconDefaults, defaults, icon)
					);
					if (list !== 'none') {
						added.push(name);
					}
				}
			});
		}
	} catch (err) {
		return false;
	}

	return list === 'none' ? true : added;
}

/**
 * Add icon to storage
 */
export function addIcon(
	storage: IconStorage,
	name: string,
	icon: IconifyIcon
): boolean {
	try {
		if (typeof icon.body === 'string') {
			// Freeze icon to make sure it will not be modified
			storage.icons[name] = Object.freeze(fullIcon(icon));
			return true;
		}
	} catch (err) {
		// Do nothing
	}
	return false;
}

/**
 * Check if icon exists
 */
export function iconExists(storage: IconStorage, name: string): boolean {
	return storage.icons[name] !== void 0;
}

/**
 * Get icon data
 */
export function getIcon(
	storage: IconStorage,
	name: string
): Readonly<FullIconifyIcon> | null {
	const value = storage.icons[name];
	return value === void 0 ? null : value;
}

/**
 * List available icons
 */
export function listIcons(provider?: string, prefix?: string): string[] {
	let allIcons: string[] = [];

	// Get providers
	let providers: string[];
	if (typeof provider === 'string') {
		providers = [provider];
	} else {
		providers = Object.keys(storage);
	}

	// Get all icons
	providers.forEach((provider) => {
		let prefixes: string[];

		if (typeof provider === 'string' && typeof prefix === 'string') {
			prefixes = [prefix];
		} else {
			prefixes =
				storage[provider] === void 0
					? []
					: Object.keys(storage[provider]);
		}

		prefixes.forEach((prefix) => {
			const storage = getStorage(provider, prefix);
			const icons = Object.keys(storage.icons).map(
				(name) =>
					(provider !== '' ? '@' + provider + ':' : '') +
					prefix +
					':' +
					name
			);
			allIcons = allIcons.concat(icons);
		});
	});

	return allIcons;
}
