import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import { IconifyIconName, stringToIcon } from '@iconify/utils/lib/icon/name';
import type { SortedIcons } from '../icon/sort';
import { sortIcons } from '../icon/sort';
import { storeCallback, updateCallbacks } from './callbacks';
import { getAPIModule } from './modules';
import { getStorage, addIconSet } from '../storage/storage';
import { listToIcons } from '../icon/list';
import { allowSimpleNames, getIconData } from '../storage/functions';
import { sendAPIQuery } from './query';
import { storeInBrowserStorage } from '../browser-storage/store';
import type { IconStorageWithIcons } from './types';

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
function loadedNewIcons(storage: IconStorageWithIcons): void {
	// Run only once per tick, possibly joining multiple API responses in one call
	if (!storage.iconsLoaderFlag) {
		storage.iconsLoaderFlag = true;
		setTimeout(() => {
			storage.iconsLoaderFlag = false;
			updateCallbacks(storage);
		});
	}
}

/**
 * Load icons
 */
function loadNewIcons(storage: IconStorageWithIcons, icons: string[]): void {
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

			// Get API module
			let api: ReturnType<typeof getAPIModule>;
			if (!icons || !(api = getAPIModule(provider))) {
				// No icons or no way to load icons!
				return;
			}

			// Prepare parameters and run queries
			const params = api.prepare(provider, prefix, icons);
			params.forEach((item) => {
				sendAPIQuery(provider, item, (data, error) => {
					// Check for error
					if (typeof data !== 'object') {
						if (error !== 404) {
							// Do not handle error unless it is 404
							return;
						}

						// Not found: mark as missing
						item.icons.forEach((name) => {
							storage.missing.add(name);
						});
					} else {
						// Add icons to storage
						try {
							const parsed = addIconSet(
								storage,
								data as IconifyJSON
							);
							if (!parsed.length) {
								return;
							}

							// Remove added icons from pending list
							const pending = storage.pendingIcons;
							if (pending) {
								parsed.forEach((name) => {
									pending.delete(name);
								});
							}

							// Cache API response
							storeInBrowserStorage(
								provider,
								data as IconifyJSON
							);
						} catch (err) {
							console.error(err);
						}
					}

					// Trigger update on next tick
					loadedNewIcons(storage);
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
	) as IconStorageWithIcons;
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
	const sources: IconStorageWithIcons[] = [];
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

		const storage = getStorage(provider, prefix) as IconStorageWithIcons;
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
		const { provider, prefix } = storage;
		if (newIcons[provider][prefix].length) {
			loadNewIcons(storage, newIcons[provider][prefix]);
		}
	});

	// Store callback and return abort function
	return callback
		? storeCallback(callback, sortedIcons, sources)
		: emptyCallback;
};

/**
 * Cache for loadIcon promises
 */
export const loadIcon = (
	icon: IconifyIconName | string
): Promise<Required<IconifyIcon>> => {
	return new Promise((fulfill, reject) => {
		const iconObj = typeof icon === 'string' ? stringToIcon(icon) : icon;
		loadIcons([iconObj || icon], (loaded) => {
			if (loaded.length && iconObj) {
				const data = getIconData(iconObj);
				if (data) {
					fulfill({
						...data,
					});
					return;
				}
			}

			reject(icon);
		});
	});
};
