import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { fullIcon } from '@iconify/utils/lib/icon';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';

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
 * Storage format version
 */
const storageVersion = 1;

/**
 * Storage by provider and prefix
 */
let storage: Record<string, Record<string, IconStorage>> = Object.create(null);

/**
 * Share storage
 */
interface WindowWithStorage extends Window {
	_iconifyStorage: {
		version: number;
		storage: Record<string, Record<string, IconStorage>>;
	};
}

try {
	const w = (window || self) as unknown as WindowWithStorage | undefined;
	if (w?._iconifyStorage.version === storageVersion) {
		storage = w._iconifyStorage.storage;
	}
} catch (err) {
	//
}

/**
 * Share storage between components
 */
export function shareStorage(): void {
	try {
		const w = (window || self) as unknown as WindowWithStorage | undefined;
		if (w && !w._iconifyStorage) {
			w._iconifyStorage = {
				version: storageVersion,
				storage,
			};
		}
	} catch (err) {
		//
	}
}

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
 * Add icon set to storage
 *
 * Returns array of added icons
 */
export function addIconSet(storage: IconStorage, data: IconifyJSON): string[] {
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
export function getIconFromStorage(
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
