import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import {
	type IconifyIconName,
	matchIconName,
	stringToIcon,
} from '@iconify/utils/lib/icon/name';
import type { SortedIcons } from '../icon/sort';
import { sortIcons } from '../icon/sort';
import { storeCallback, updateCallbacks } from './callbacks';
import { getAPIModule } from './modules';
import { getStorage, addIconSet } from '../storage/storage';
import { listToIcons } from '../icon/list';
import { allowSimpleNames, getIconData } from '../storage/functions';
import { sendAPIQuery } from './query';
import type { IconStorageWithAPI } from './types';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';

// Empty abort callback for loadIcons()
function emptyCallback(): void {
	// Do nothing
}

/**
 * Function to abort loading (usually just removes callback because loading is already in progress)
 */
export type IconifyIconLoaderAbort = () => void;

/**
 * Loader callback
 *
 * Provides list of icons that have been loaded
 */
export type IconifyIconLoaderCallback = (
	loaded: IconifyIconName[],
	missing: IconifyIconName[],
	pending: IconifyIconName[],
	unsubscribe: IconifyIconLoaderAbort
) => void;

/**
 * Function to load icons
 */
export type IconifyLoadIcons = (
	icons: (IconifyIconName | string)[],
	callback?: IconifyIconLoaderCallback
) => IconifyIconLoaderAbort;

/**
 * Function to check if icon is pending
 */
export type IsPending = (icon: IconifyIconName) => boolean;

/**
 * Function called when new icons have been loaded
 */
function loadedNewIcons(storage: IconStorageWithAPI): void {
	// Run only once per tick, possibly joining multiple API responses in one call
	if (!storage.iconsLoaderFlag) {
		storage.iconsLoaderFlag = true;
		setTimeout(() => {
			storage.iconsLoaderFlag = false;
			updateCallbacks(storage);
		});
	}
}

interface CheckIconNames {
	valid: string[];
	invalid: string[];
}
/**
 * Check icon names for API
 */
function checkIconNamesForAPI(icons: string[]): CheckIconNames {
	const valid: string[] = [];
	const invalid: string[] = [];

	icons.forEach((name) => {
		(name.match(matchIconName) ? valid : invalid).push(name);
	});
	return {
		valid,
		invalid,
	};
}

/**
 * Parse loader response
 */
function parseLoaderResponse(
	storage: IconStorageWithAPI,
	icons: string[],
	data: unknown
) {
	function checkMissing() {
		const pending = storage.pendingIcons;
		icons.forEach((name) => {
			// Remove added icons from pending list
			if (pending) {
				pending.delete(name);
			}

			// Mark as missing if icon is not in storage
			if (!storage.icons[name]) {
				storage.missing.add(name);
			}
		});
	}

	// Check for error
	if (data && typeof data === 'object') {
		// Add icons to storage
		try {
			const parsed = addIconSet(storage, data as IconifyJSON);
			if (!parsed.length) {
				checkMissing();
				return;
			}
		} catch (err) {
			console.error(err);
		}
	}

	// Check for some icons from request were not in response: mark as missing
	checkMissing();

	// Trigger update on next tick
	loadedNewIcons(storage);
}

/**
 * Handle response that can be async
 */
function parsePossiblyAsyncResponse<T>(
	response: T | null | Promise<T | null>,
	callback: (data: T | null) => void
): void {
	if (response instanceof Promise) {
		// Custom loader is async
		response
			.then((data) => {
				callback(data);
			})
			.catch(() => {
				callback(null);
			});
	} else {
		// Sync loader
		callback(response);
	}
}

/**
 * Load icons
 */
function loadNewIcons(storage: IconStorageWithAPI, icons: string[]): void {
	// Add icons to queue
	if (!storage.iconsToLoad) {
		storage.iconsToLoad = icons;
	} else {
		storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
	}

	// Trigger update on next tick, mering multiple synchronous requests into one asynchronous request
	if (!storage.iconsQueueFlag) {
		storage.iconsQueueFlag = true;
		setTimeout(() => {
			storage.iconsQueueFlag = false;
			const { provider, prefix } = storage;

			// Get icons and delete queue
			const icons = storage.iconsToLoad;
			delete storage.iconsToLoad;
			if (!icons || !icons.length) {
				// Icons should not be undefined or empty, but just in case check it
				return;
			}

			// Check for custom loader for multiple icons
			const customIconLoader = storage.loadIcon;
			if (storage.loadIcons && (icons.length > 1 || !customIconLoader)) {
				parsePossiblyAsyncResponse(
					storage.loadIcons(icons, prefix, provider),
					(data) => {
						parseLoaderResponse(storage, icons, data);
					}
				);
				return;
			}

			// Check for custom loader for one icon
			if (customIconLoader) {
				icons.forEach((name) => {
					const response = customIconLoader(name, prefix, provider);
					parsePossiblyAsyncResponse(response, (data) => {
						const iconSet: IconifyJSON | null = data
							? {
									prefix,
									icons: {
										[name]: data,
									},
							  }
							: null;
						parseLoaderResponse(storage, [name], iconSet);
					});
				});
				return;
			}

			// Using API loader
			// Validate icon names for API
			const { valid, invalid } = checkIconNamesForAPI(icons);

			if (invalid.length) {
				// Invalid icons
				parseLoaderResponse(storage, invalid, null);
			}
			if (!valid.length) {
				// No valid icons to load
				return;
			}

			// Get API module
			const api = prefix.match(matchIconName)
				? getAPIModule(provider)
				: null;
			if (!api) {
				// API module not found
				parseLoaderResponse(storage, valid, null);
				return;
			}

			// Prepare parameters and run queries
			const params = api.prepare(provider, prefix, valid);
			params.forEach((item) => {
				sendAPIQuery(provider, item, (data) => {
					parseLoaderResponse(storage, item.icons, data);
				});
			});
		});
	}
}

/**
 * Check if icon is being loaded
 */
export const isPending: IsPending = (icon: IconifyIconName): boolean => {
	const storage = getStorage(
		icon.provider,
		icon.prefix
	) as IconStorageWithAPI;
	const pending = storage.pendingIcons;
	return !!(pending && pending.has(icon.name));
};

/**
 * Load icons
 */
export const loadIcons: IconifyLoadIcons = (
	icons: (IconifyIconName | string)[],
	callback?: IconifyIconLoaderCallback
): IconifyIconLoaderAbort => {
	// Clean up and copy icons list
	const cleanedIcons = listToIcons(icons, true, allowSimpleNames());

	// Sort icons by missing/loaded/pending
	// Pending means icon is either being requsted or is about to be requested
	const sortedIcons: SortedIcons = sortIcons(cleanedIcons);

	if (!sortedIcons.pending.length) {
		// Nothing to load
		let callCallback = true;

		if (callback) {
			setTimeout(() => {
				if (callCallback) {
					callback(
						sortedIcons.loaded,
						sortedIcons.missing,
						sortedIcons.pending,
						emptyCallback
					);
				}
			});
		}
		return (): void => {
			callCallback = false;
		};
	}

	// Get all sources for pending icons
	type PrefixNewIconsList = string[];
	type ProviderNewIconsList = Record<string, PrefixNewIconsList>;

	const newIcons = Object.create(null) as Record<
		string,
		ProviderNewIconsList
	>;
	const sources: IconStorageWithAPI[] = [];
	let lastProvider: string, lastPrefix: string;

	sortedIcons.pending.forEach((icon) => {
		const { provider, prefix } = icon;
		if (prefix === lastPrefix && provider === lastProvider) {
			return;
		}

		lastProvider = provider;
		lastPrefix = prefix;
		sources.push(getStorage(provider, prefix));

		const providerNewIcons =
			newIcons[provider] ||
			(newIcons[provider] = Object.create(null) as ProviderNewIconsList);
		if (!providerNewIcons[prefix]) {
			providerNewIcons[prefix] = [];
		}
	});

	// List of new icons
	// Filter pending icons list: find icons that are not being loaded yet
	// If icon was called before, it must exist in pendingIcons or storage, but because this
	// function is called right after sortIcons() that checks storage, icon is definitely not in storage.
	sortedIcons.pending.forEach((icon) => {
		const { provider, prefix, name } = icon;

		const storage = getStorage(provider, prefix) as IconStorageWithAPI;
		const pendingQueue =
			storage.pendingIcons || (storage.pendingIcons = new Set());

		if (!pendingQueue.has(name)) {
			// New icon - add to pending queue to mark it as being loaded
			pendingQueue.add(name);
			// Add it to new icons list to pass it to API module for loading
			newIcons[provider][prefix].push(name);
		}
	});

	// Load icons on next tick to make sure result is not returned before callback is stored and
	// to consolidate multiple synchronous loadIcons() calls into one asynchronous API call
	sources.forEach((storage) => {
		const list = newIcons[storage.provider][storage.prefix];
		if (list.length) {
			loadNewIcons(storage, list);
		}
	});

	// Store callback and return abort function
	return callback
		? storeCallback(callback, sortedIcons, sources)
		: emptyCallback;
};

/**
 * Load one icon using Promise
 */
export const loadIcon = (
	icon: IconifyIconName | string
): Promise<Required<IconifyIcon>> => {
	return new Promise((fulfill, reject) => {
		const iconObj =
			typeof icon === 'string' ? stringToIcon(icon, true) : icon;
		if (!iconObj) {
			reject(icon);
			return;
		}

		loadIcons([iconObj || icon], (loaded) => {
			if (loaded.length && iconObj) {
				const data = getIconData(iconObj);
				if (data) {
					fulfill({
						...defaultIconProps,
						...data,
					});
					return;
				}
			}

			reject(icon);
		});
	});
};
