import {
	Redundancy,
	initRedundancy,
	RedundancyQueryCallback,
} from '@cyberalien/redundancy';
import { SortedIcons, sortIcons } from '../icon/sort';
import {
	IconifyIconLoaderAbort,
	IconifyIconLoaderCallback,
	IconifyLoadIcons,
} from '../interfaces/loader';
import { IsPending, IconifyAPI } from '../interfaces/api';
import { storeCallback, updateCallbacks } from './callbacks';
import { getAPIModule } from './modules';
import { getAPIConfig, IconifyAPIConfig } from './config';
import { getStorage, addIconSet } from '../storage';
import { coreModules } from '../modules';
import { IconifyIconName, IconifyIconSource } from '../icon/name';
import { listToIcons } from '../icon/list';
import { IconifyJSON } from '@iconify/types';

// Empty abort callback for loadIcons()
function emptyCallback(): void {
	// Do nothing
}

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

// Redundancy instances cache, sorted by provider
export interface IconifyAPIInternalStorage {
	config: IconifyAPIConfig;
	redundancy: Redundancy;
}
const redundancyCache: Record<
	string,
	IconifyAPIInternalStorage
> = Object.create(null);

/**
 * Get Redundancy instance for provider
 */
export function getRedundancyCache(
	provider: string
): IconifyAPIInternalStorage | undefined {
	if (redundancyCache[provider] === void 0) {
		const config = getAPIConfig(provider);
		if (!config) {
			// No way to load icons because configuration is not set!
			return;
		}

		const redundancy = initRedundancy(config);
		const cachedReundancy = {
			config,
			redundancy,
		};
		redundancyCache[provider] = cachedReundancy;
	}

	return redundancyCache[provider];
}

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

/**
 * Load icons
 */
function loadNewIcons(provider: string, prefix: string, icons: string[]): void {
	function err(): void {
		console.error(
			'Unable to retrieve icons for "' +
				(provider === '' ? '' : '@' + provider + ':') +
				prefix +
				'" because API is not configured properly.'
		);
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

	// Redundancy item
	let cachedReundancy: IconifyAPIInternalStorage;

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

			// Get API config and Redundancy instance
			if (cachedReundancy === void 0) {
				const redundancy = getRedundancyCache(provider);
				if (redundancy === void 0) {
					// No way to load icons because configuration is not set!
					err();
					return;
				}
				cachedReundancy = redundancy;
			}

			// Prepare parameters and run queries
			const params = api.prepare(provider, prefix, icons);
			params.forEach((item) => {
				cachedReundancy.redundancy.query(
					item,
					api.send as RedundancyQueryCallback,
					(data) => {
						// Add icons to storage
						const storage = getStorage(provider, prefix);
						try {
							const added = addIconSet(
								storage,
								data as IconifyJSON,
								'all'
							);
							if (typeof added === 'boolean') {
								return;
							}

							// Remove added icons from pending list
							const pending = providerPendingIcons[prefix];
							added.forEach((name) => {
								delete pending[name];
							});

							// Cache API response
							if (coreModules.cache) {
								coreModules.cache(
									provider,
									data as IconifyJSON
								);
							}
						} catch (err) {
							console.error(err);
						}

						// Trigger update on next tick
						loadedNewIcons(provider, prefix);
					}
				);
			});
		});
	}
}

/**
 * Check if icon is being loaded
 */
const isPending: IsPending = (icon: IconifyIconName): boolean => {
	return (
		pendingIcons[icon.provider] !== void 0 &&
		pendingIcons[icon.provider][icon.prefix] !== void 0 &&
		pendingIcons[icon.provider][icon.prefix][icon.name] !== void 0
	);
};

/**
 * Load icons
 */
const loadIcons: IconifyLoadIcons = (
	icons: (IconifyIconName | string)[],
	callback?: IconifyIconLoaderCallback
): IconifyIconLoaderAbort => {
	// Clean up and copy icons list
	const cleanedIcons = listToIcons(icons, true);

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
 * Export module
 */
export const API: IconifyAPI = {
	isPending,
	loadIcons,
};
