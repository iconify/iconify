import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import {
	IconifyIconName,
	IconifyIconSource,
	stringToIcon,
} from '@iconify/utils/lib/icon/name';
import type { SortedIcons } from '../icon/sort';
import { sortIcons } from '../icon/sort';
import { storeCallback, updateCallbacks } from './callbacks';
import { getAPIModule } from './modules';
import { getStorage, addIconSet, getIconFromStorage } from '../storage/storage';
import { listToIcons } from '../icon/list';
import { allowSimpleNames } from '../storage/functions';
import { sendAPIQuery } from './query';
import { cache } from '../cache';

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
 * List of icons that are being loaded.
 *
 * Icons are added to this list when they are being checked and
 * removed from this list when they are added to storage as
 * either an icon or a missing icon. This way same icon should
 * never be requested twice.
 *
 * [provider][prefix][icon] = time when icon was added to queue
 */
type PendingIcons = Record<string, number>;
const pendingIcons: Record<
	string,
	Record<string, PendingIcons>
> = Object.create(null);

/**
 * List of icons that are waiting to be loaded.
 *
 * List is passed to API module, then cleared.
 *
 * This list should not be used for any checks, use pendingIcons to check
 * if icons is being loaded.
 *
 * [provider][prefix] = array of icon names
 */
const iconsToLoad: Record<string, Record<string, string[]>> = Object.create(
	null
);

// Flags to merge multiple synchronous icon requests in one asynchronous request
const loaderFlags: Record<string, Record<string, boolean>> = Object.create(
	null
);
const queueFlags: Record<string, Record<string, boolean>> = Object.create(null);

/**
 * Function called when new icons have been loaded
 */
function loadedNewIcons(provider: string, prefix: string): void {
	// Run only once per tick, possibly joining multiple API responses in one call
	if (loaderFlags[provider] === void 0) {
		loaderFlags[provider] = Object.create(null);
	}
	const providerLoaderFlags = loaderFlags[provider];
	if (!providerLoaderFlags[prefix]) {
		providerLoaderFlags[prefix] = true;
		setTimeout(() => {
			providerLoaderFlags[prefix] = false;
			updateCallbacks(provider, prefix);
		});
	}
}

// Storage for errors for loadNewIcons(). Used to avoid spamming log with identical errors.
const errorsCache: Record<string, number> = Object.create(null);

/**
 * Load icons
 */
function loadNewIcons(provider: string, prefix: string, icons: string[]): void {
	function err(): void {
		const key = (provider === '' ? '' : '@' + provider + ':') + prefix;
		const time = Math.floor(Date.now() / 60000); // log once in a minute
		if (errorsCache[key] < time) {
			errorsCache[key] = time;
			console.error(
				'Unable to retrieve icons for "' +
					key +
					'" because API is not configured properly.'
			);
		}
	}

	// Create nested objects if needed
	if (iconsToLoad[provider] === void 0) {
		iconsToLoad[provider] = Object.create(null);
	}
	const providerIconsToLoad = iconsToLoad[provider];

	if (queueFlags[provider] === void 0) {
		queueFlags[provider] = Object.create(null);
	}
	const providerQueueFlags = queueFlags[provider];

	if (pendingIcons[provider] === void 0) {
		pendingIcons[provider] = Object.create(null);
	}
	const providerPendingIcons = pendingIcons[provider];

	// Add icons to queue
	if (providerIconsToLoad[prefix] === void 0) {
		providerIconsToLoad[prefix] = icons;
	} else {
		providerIconsToLoad[prefix] = providerIconsToLoad[prefix]
			.concat(icons)
			.sort();
	}

	// Trigger update on next tick, mering multiple synchronous requests into one asynchronous request
	if (!providerQueueFlags[prefix]) {
		providerQueueFlags[prefix] = true;
		setTimeout(() => {
			providerQueueFlags[prefix] = false;

			// Get icons and delete queue
			const icons = providerIconsToLoad[prefix];
			delete providerIconsToLoad[prefix];

			// Get API module
			const api = getAPIModule(provider);
			if (!api) {
				// No way to load icons!
				err();
				return;
			}

			// Prepare parameters and run queries
			const params = api.prepare(provider, prefix, icons);
			params.forEach((item) => {
				sendAPIQuery(provider, item, (data, error) => {
					const storage = getStorage(provider, prefix);

					// Check for error
					if (typeof data !== 'object') {
						if (error !== 404) {
							// Do not handle error unless it is 404
							return;
						}

						// Not found: mark as missing
						const t = Date.now();
						item.icons.forEach((name) => {
							storage.missing[name] = t;
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
							const pending = providerPendingIcons[prefix];
							parsed.forEach((name) => {
								delete pending[name];
							});

							// Cache API response
							if (cache.store) {
								cache.store(provider, data as IconifyJSON);
							}
						} catch (err) {
							console.error(err);
						}
					}

					// Trigger update on next tick
					loadedNewIcons(provider, prefix);
				});
			});
		});
	}
}

/**
 * Check if icon is being loaded
 */
export const isPending: IsPending = (icon: IconifyIconName): boolean => {
	const provider = icon.provider;
	const prefix = icon.prefix;
	return (
		pendingIcons[provider] &&
		pendingIcons[provider][prefix] &&
		pendingIcons[provider][prefix][icon.name] !== void 0
	);
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
	const newIcons: Record<string, Record<string, string[]>> = Object.create(
		null
	);
	const sources: IconifyIconSource[] = [];
	let lastProvider: string, lastPrefix: string;

	sortedIcons.pending.forEach((icon) => {
		const provider = icon.provider;
		const prefix = icon.prefix;
		if (prefix === lastPrefix && provider === lastProvider) {
			return;
		}

		lastProvider = provider;
		lastPrefix = prefix;
		sources.push({
			provider,
			prefix,
		});

		if (pendingIcons[provider] === void 0) {
			pendingIcons[provider] = Object.create(null);
		}
		const providerPendingIcons = pendingIcons[provider];
		if (providerPendingIcons[prefix] === void 0) {
			providerPendingIcons[prefix] = Object.create(null);
		}

		if (newIcons[provider] === void 0) {
			newIcons[provider] = Object.create(null);
		}
		const providerNewIcons = newIcons[provider];
		if (providerNewIcons[prefix] === void 0) {
			providerNewIcons[prefix] = [];
		}
	});

	// List of new icons
	const time = Date.now();

	// Filter pending icons list: find icons that are not being loaded yet
	// If icon was called before, it must exist in pendingIcons or storage, but because this
	// function is called right after sortIcons() that checks storage, icon is definitely not in storage.
	sortedIcons.pending.forEach((icon) => {
		const provider = icon.provider;
		const prefix = icon.prefix;
		const name = icon.name;

		const pendingQueue = pendingIcons[provider][prefix];
		if (pendingQueue[name] === void 0) {
			// New icon - add to pending queue to mark it as being loaded
			pendingQueue[name] = time;
			// Add it to new icons list to pass it to API module for loading
			newIcons[provider][prefix].push(name);
		}
	});

	// Load icons on next tick to make sure result is not returned before callback is stored and
	// to consolidate multiple synchronous loadIcons() calls into one asynchronous API call
	sources.forEach((source) => {
		const provider = source.provider;
		const prefix = source.prefix;
		if (newIcons[provider][prefix].length) {
			loadNewIcons(provider, prefix, newIcons[provider][prefix]);
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
type LoadIconResult = Promise<Required<IconifyIcon>>;
const iconsQueue: Record<string, LoadIconResult> = Object.create(null);

export const loadIcon = (icon: IconifyIconName | string): LoadIconResult => {
	if (typeof icon === 'string' && iconsQueue[icon]) {
		return iconsQueue[icon];
	}

	const result: LoadIconResult = new Promise((fulfill, reject) => {
		const iconObj = typeof icon === 'string' ? stringToIcon(icon) : icon;
		loadIcons([iconObj || icon], (loaded) => {
			if (loaded.length && iconObj) {
				const storage = getStorage(iconObj.provider, iconObj.prefix);
				const data = getIconFromStorage(storage, iconObj.name);
				if (data) {
					fulfill(data);
					return;
				}
			}

			reject(icon);
		});
	});

	if (typeof icon === 'string') {
		iconsQueue[icon] = result;
	}
	return result;
};
