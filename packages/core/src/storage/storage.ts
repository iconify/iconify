import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { quicklyValidateIconSet } from '@iconify/utils/lib/icon-set/validate-basic';

/**
 * List of icons
 */
type IconRecords = Record<string, IconifyIcon>;

/**
 * Storage type
 */
export interface IconStorage {
	// Provider and prefix
	provider: string;
	prefix: string;

	// List of available icons
	icons: IconRecords;

	// List of missing icons
	missing: Set<string>;
}

/**
 * Storage by provider and prefix
 */
export const dataStorage = Object.create(null) as Record<
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
		missing: new Set(),
	};
}

/**
 * Get storage for provider and prefix
 */
export function getStorage(provider: string, prefix: string): IconStorage {
	const providerStorage =
		dataStorage[provider] ||
		(dataStorage[provider] = Object.create(null) as Record<
			string,
			IconStorage
		>);
	return (
		providerStorage[prefix] ||
		(providerStorage[prefix] = newStorage(provider, prefix))
	);
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

	return parseIconSet(data, (name: string, icon: IconifyIcon | null) => {
		if (icon) {
			storage.icons[name] = icon;
		} else {
			storage.missing.add(name);
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
			// Make a copy of object to make sure it will not be not modified
			storage.icons[name] = { ...icon };
			return true;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		// Do nothing
	}
	return false;
}

/**
 * Check if icon is available in storage
 */
export function iconInStorage(storage: IconStorage, name: string): boolean {
	return !!storage.icons[name];
}

/**
 * List available icons
 */
export function listIcons(provider?: string, prefix?: string): string[] {
	let allIcons: string[] = [];

	// Get providers
	const providers =
		typeof provider === 'string' ? [provider] : Object.keys(dataStorage);

	// Get all icons
	providers.forEach((provider) => {
		const prefixes =
			typeof provider === 'string' && typeof prefix === 'string'
				? [prefix]
				: Object.keys(dataStorage[provider] || {});

		prefixes.forEach((prefix) => {
			const storage = getStorage(provider, prefix);
			allIcons = allIcons.concat(
				Object.keys(storage.icons).map(
					(name) =>
						(provider !== '' ? '@' + provider + ':' : '') +
						prefix +
						':' +
						name
				)
			);
		});
	});

	return allIcons;
}
