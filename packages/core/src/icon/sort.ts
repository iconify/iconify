import type { IconStorage } from '../storage/storage';
import { getStorage } from '../storage/storage';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';

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
	const storage = Object.create(null) as Record<
		string,
		Record<string, IconStorage>
	>;

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

		const providerStorage =
			storage[provider] ||
			(storage[provider] = Object.create(null) as Record<
				string,
				IconStorage
			>);

		const localStorage =
			providerStorage[prefix] ||
			(providerStorage[prefix] = getStorage(provider, prefix));

		let list;
		if (name in localStorage.icons) {
			list = result.loaded;
		} else if (prefix === '' || localStorage.missing.has(name)) {
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
