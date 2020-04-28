import { getStorage, IconStorage } from '../storage';
import { IconifyIconName } from './name';

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
	const storage: Record<string, IconStorage> = Object.create(null);

	// Sort icons alphabetically to prevent duplicates and make sure they are sorted in API queries
	icons.sort((a, b) => {
		if (a.prefix === b.prefix) {
			return a.name.localeCompare(b.name);
		}
		return a.prefix.localeCompare(b.prefix);
	});

	let lastIcon: IconifyIconName = {
		prefix: '',
		name: '',
	};
	icons.forEach(icon => {
		if (lastIcon.prefix === icon.prefix && lastIcon.name === icon.name) {
			return;
		}
		lastIcon = icon;

		// Check icon
		const prefix = icon.prefix;
		const name = icon.name;

		if (storage[prefix] === void 0) {
			storage[prefix] = getStorage(prefix);
		}

		const localStorage = storage[prefix];

		let list;
		if (localStorage.icons[name] !== void 0) {
			list = result.loaded;
		} else if (localStorage.missing[name] !== void 0) {
			list = result.missing;
		} else {
			list = result.pending;
		}

		const item: IconifyIconName = {
			prefix,
			name,
		};
		list.push(item);
	});

	return result;
}
