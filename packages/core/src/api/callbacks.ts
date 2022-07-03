import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from './icons';
import type { SortedIcons } from '../icon/sort';
import type { APICallbackItem, IconStorageWithAPI } from './types';

/**
 * Remove callback
 */
function removeCallback(storages: IconStorageWithAPI[], id: number): void {
	storages.forEach((storage) => {
		const items = storage.loaderCallbacks;
		if (items) {
			storage.loaderCallbacks = items.filter((row) => row.id !== id);
		}
	});
}

/**
 * Update all callbacks for provider and prefix
 */
export function updateCallbacks(storage: IconStorageWithAPI): void {
	if (!storage.pendingCallbacksFlag) {
		storage.pendingCallbacksFlag = true;
		setTimeout(() => {
			storage.pendingCallbacksFlag = false;

			// Get all items
			const items = storage.loaderCallbacks
				? storage.loaderCallbacks.slice(0)
				: [];
			if (!items.length) {
				return;
			}

			// Check each item for changes
			let hasPending = false;
			const provider = storage.provider;
			const prefix = storage.prefix;

			items.forEach((item) => {
				const icons = item.icons;
				const oldLength = icons.pending.length;
				icons.pending = icons.pending.filter((icon) => {
					if (icon.prefix !== prefix) {
						// Checking only current prefix
						return true;
					}

					const name = icon.name;
					if (storage.icons[name]) {
						// Loaded
						icons.loaded.push({
							provider,
							prefix,
							name,
						});
					} else if (storage.missing.has(name)) {
						// Missing
						icons.missing.push({
							provider,
							prefix,
							name,
						});
					} else {
						// Pending
						hasPending = true;
						return true;
					}

					return false;
				});

				// Changes detected - call callback
				if (icons.pending.length !== oldLength) {
					if (!hasPending) {
						// All icons have been loaded - remove callback from prefix
						removeCallback([storage], item.id);
					}
					item.callback(
						icons.loaded.slice(0),
						icons.missing.slice(0),
						icons.pending.slice(0),
						item.abort
					);
				}
			});
		});
	}
}

/**
 * Unique id counter for callbacks
 */
let idCounter = 0;

/**
 * Add callback
 */
export function storeCallback(
	callback: IconifyIconLoaderCallback,
	icons: SortedIcons,
	pendingSources: IconStorageWithAPI[]
): IconifyIconLoaderAbort {
	// Create unique id and abort function
	const id = idCounter++;
	const abort = removeCallback.bind(null, pendingSources, id);

	if (!icons.pending.length) {
		// Do not store item without pending icons and return function that does nothing
		return abort;
	}

	// Create item and store it for all pending prefixes
	const item: APICallbackItem = {
		id,
		icons,
		callback,
		abort: abort,
	};

	pendingSources.forEach((storage) => {
		(storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
	});

	return abort;
}
