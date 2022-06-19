import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon/defaults';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { quicklyValidateIconSet } from '@iconify/utils/lib/icon-set/validate-basic';

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
const storage = Object.create(null) as Record<
	string,
	Record<string, IconStorage>
>;

/**
 * Create new storage
 */
export function newStorage(provider: string, prefix: string): IconStorage {
	return {
		provider,
		prefix,
		icons: Object.create(null) as IconStorage['icons'],
		missing: Object.create(null) as IconStorage['missing'],
	};
}

/**
 * Get storage for provider and prefix
 */
export function getStorage(provider: string, prefix: string): IconStorage {
	if (storage[provider] === void 0) {
		storage[provider] = Object.create(null) as Record<string, IconStorage>;
	}
	const providerStorage = storage[provider];
	if (providerStorage[prefix] === void 0) {
		providerStorage[prefix] = newStorage(provider, prefix);
	}
	return providerStorage[prefix];
}

/**
 * Add icon set to storage
 *
 * Returns array of added icons
 */
export function addIconSet(storage: IconStorage, data: IconifyJSON): string[] {
	if (!quicklyValidateIconSet(data)) {
		return [];
	}

	const t = Date.now();
	return parseIconSet(data, (name, icon: FullIconifyIcon | null) => {
		if (icon) {
			storage.icons[name] = icon;
		} else {
			storage.missing[name] = t;
		}
	});
}

/**
 * Add icon to storage
 */
export function addIconToStorage(
	storage: IconStorage,
	name: string,
	icon: IconifyIcon
): boolean {
	try {
		if (typeof icon.body === 'string') {
			// Freeze icon to make sure it will not be modified
			storage.icons[name] = Object.freeze({
				...defaultIconProps,
				...icon,
			});
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
