import type { IconStorage } from '../storage/storage';
import { getStorage } from '../storage/storage';
import type { IconifyIconName } from './name';

/**
 * Sorted icons list
 */
export interface SortedIcons {
	loaded: IconifyIconName[];
	missing: IconifyIconName[];
	pending: IconifyIconName[];
}

/**
 * Check if icons have been loaded
 */
export function sortIcons(icons: IconifyIconName[]): SortedIcons {
	const result: SortedIcons = {
		loaded: [],
		missing: [],
		pending: [],
	};
	const storage: Record<string, Record<string, IconStorage>> = Object.create(
		null
	);

	// Sort icons alphabetically to prevent duplicates and make sure they are sorted in API queries
	icons.sort((a, b) => {
		if (a.provider !== b.provider) {
			return a.provider.localeCompare(b.provider);
		}
		if (a.prefix !== b.prefix) {
			return a.prefix.localeCompare(b.prefix);
		}
		return a.name.localeCompare(b.name);
	});

	let lastIcon: IconifyIconName = {
		provider: '',
		prefix: '',
		name: '',
	};
	icons.forEach((icon) => {
		if (
			lastIcon.name === icon.name &&
			lastIcon.prefix === icon.prefix &&
			lastIcon.provider === icon.provider
		) {
			return;
		}
		lastIcon = icon;

		// Check icon
		const provider = icon.provider;
		const prefix = icon.prefix;
		const name = icon.name;

		if (storage[provider] === void 0) {
			storage[provider] = Object.create(null);
		}
		const providerStorage = storage[provider];

		if (providerStorage[prefix] === void 0) {
			providerStorage[prefix] = getStorage(provider, prefix);
		}
		const localStorage = providerStorage[prefix];

		let list;
		if (localStorage.icons[name] !== void 0) {
			list = result.loaded;
		} else if (prefix === '' || localStorage.missing[name] !== void 0) {
			// Mark icons without prefix as missing because they cannot be loaded from API
			list = result.missing;
		} else {
			list = result.pending;
		}

		const item: IconifyIconName = {
			provider,
			prefix,
			name,
		};
		list.push(item);
	});

	return result;
}
