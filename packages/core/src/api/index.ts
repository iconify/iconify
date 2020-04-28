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
import { IconifyIconName } from '../icon/name';
import { listToIcons, getPrefixes } from '../icon/list';
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
 * [prefix][icon] = time when icon was added to queue
 */
type PendingIcons = Record<string, number>;
const pendingIcons: Record<string, PendingIcons> = Object.create(null);

/**
 * List of icons that are waiting to be loaded.
 *
 * List is passed to API module, then cleared.
 *
 * This list should not be used for any checks, use pendingIcons to check
 * if icons is being loaded.
 *
 * [prefix] = array of icon names
 */
const iconsToLoad: Record<string, string[]> = Object.create(null);

// Flags to merge multiple synchronous icon requests in one asynchronous request
const loaderFlags: Record<string, boolean> = Object.create(null);
const queueFlags: Record<string, boolean> = Object.create(null);

// Redundancy instances cache
interface LocalCache {
	config: IconifyAPIConfig | null;
	redundancy: Redundancy | null;
}
const redundancyCache: Record<string, LocalCache> = Object.create(null);

/**
 * Function called when new icons have been loaded
 */
function loadedNewIcons(prefix: string): void {
	// Run only once per tick, possibly joining multiple API responses in one call
	if (!loaderFlags[prefix]) {
		loaderFlags[prefix] = true;
		setTimeout(() => {
			loaderFlags[prefix] = false;
			updateCallbacks(prefix);
		});
	}
}

/**
 * Load icons
 */
function loadNewIcons(prefix: string, icons: string[]): void {
	function err(): void {
		console.error(
			'Unable to retrieve icons for prefix "' +
				prefix +
				'" because API is not configured properly.'
		);
	}

	// Add icons to queue
	if (iconsToLoad[prefix] === void 0) {
		iconsToLoad[prefix] = icons;
	} else {
		iconsToLoad[prefix] = iconsToLoad[prefix].concat(icons).sort();
	}

	// Trigger update on next tick, mering multiple synchronous requests into one asynchronous request
	if (!queueFlags[prefix]) {
		queueFlags[prefix] = true;
		setTimeout(() => {
			queueFlags[prefix] = false;

			// Get icons and delete queue
			const icons = iconsToLoad[prefix];
			delete iconsToLoad[prefix];

			// Get API module
			const api = getAPIModule(prefix);
			if (!api) {
				// No way to load icons!
				err();
				return;
			}

			// Get Redundancy instance
			if (redundancyCache[prefix] === void 0) {
				const config = getAPIConfig(prefix);

				// Attempt to find matching instance from other prefixes
				// Using same Redundancy instance allows keeping track of failed hosts for multiple prefixes
				for (const prefix2 in redundancyCache) {
					const item = redundancyCache[prefix2];
					if (item.config === config) {
						redundancyCache[prefix] = item;
						break;
					}
				}

				if (redundancyCache[prefix] === void 0) {
					redundancyCache[prefix] = {
						config,
						redundancy: config ? initRedundancy(config) : null,
					};
				}
			}
			const redundancy = redundancyCache[prefix].redundancy;
			if (!redundancy) {
				// No way to load icons because configuration is not set!
				err();
				return;
			}

			// Prepare parameters and run queries
			const params = api.prepare(prefix, icons);
			params.forEach((item) => {
				redundancy.query(
					item,
					api.send as RedundancyQueryCallback,
					(data) => {
						// Add icons to storage
						const storage = getStorage(prefix);
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
							const pending = pendingIcons[prefix];
							added.forEach((name) => {
								delete pending[name];
							});

							// Cache API response
							if (coreModules.cache) {
								coreModules.cache(data as IconifyJSON);
							}
						} catch (err) {
							console.error(err);
						}

						// Trigger update on next tick
						loadedNewIcons(prefix);
					}
				);
			});
		});
	}
}

/**
 * Check if icon is being loaded
 */
const isPending: IsPending = (prefix: string, icon: string): boolean => {
	return (
		pendingIcons[prefix] !== void 0 && pendingIcons[prefix][icon] !== void 0
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

	// Get all prefixes
	const prefixes = getPrefixes(sortedIcons.pending);

	// Get pending icons queue for prefix and create new icons list
	const newIcons: Record<string, string[]> = Object.create(null);
	prefixes.forEach((prefix) => {
		if (pendingIcons[prefix] === void 0) {
			pendingIcons[prefix] = Object.create(null);
		}
		newIcons[prefix] = [];
	});

	// List of new icons
	const time = Date.now();

	// Filter pending icons list: find icons that are not being loaded yet
	// If icon was called before, it must exist in pendingIcons or storage, but because this
	// function is called right after sortIcons() that checks storage, icon is definitely not in storage.
	sortedIcons.pending.forEach((icon) => {
		const prefix = icon.prefix;
		const name = icon.name;

		const pendingQueue = pendingIcons[prefix];
		if (pendingQueue[name] === void 0) {
			// New icon - add to pending queue to mark it as being loaded
			pendingQueue[name] = time;
			// Add it to new icons list to pass it to API module for loading
			newIcons[prefix].push(name);
		}
	});

	// Load icons on next tick to make sure result is not returned before callback is stored and
	// to consolidate multiple synchronous loadIcons() calls into one asynchronous API call
	prefixes.forEach((prefix) => {
		if (newIcons[prefix].length) {
			loadNewIcons(prefix, newIcons[prefix]);
		}
	});

	// Store callback and return abort function
	return callback
		? storeCallback(callback, sortedIcons, prefixes)
		: emptyCallback;
};

/**
 * Export module
 */
export const API: IconifyAPI = {
	isPending,
	loadIcons,
};
