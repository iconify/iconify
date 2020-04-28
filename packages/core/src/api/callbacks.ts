import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '../interfaces/loader';
import { getStorage } from '../storage';
import { SortedIcons } from '../icon/sort';

/**
 * Storage for callbacks
 */
interface CallbackItem {
	// id
	id: number;

	// Icons
	icons: SortedIcons;

	// Callback to call on any update
	callback: IconifyIconLoaderCallback;

	// Callback to call to remove item from queue
	abort: IconifyIconLoaderAbort;
}

// This export is only for unit testing, should not be used
export const callbacks: Record<string, CallbackItem[]> = Object.create(null);
const pendingUpdates: Record<string, boolean> = Object.create(null);

/**
 * Remove callback
 */
function removeCallback(prefixes: string[], id: number): void {
	prefixes.forEach(prefix => {
		const items = callbacks[prefix];
		if (items) {
			callbacks[prefix] = items.filter(row => row.id !== id);
		}
	});
}

/**
 * Update all callbacks for prefix
 */
export function updateCallbacks(prefix: string): void {
	if (!pendingUpdates[prefix]) {
		pendingUpdates[prefix] = true;
		setTimeout(() => {
			pendingUpdates[prefix] = false;

			if (callbacks[prefix] === void 0) {
				return;
			}

			// Get all items
			const items = callbacks[prefix].slice(0);
			if (!items.length) {
				return;
			}

			const storage = getStorage(prefix);

			// Check each item for changes
			let hasPending = false;
			items.forEach((item: CallbackItem) => {
				const icons = item.icons;
				const oldLength = icons.pending.length;
				icons.pending = icons.pending.filter(icon => {
					if (icon.prefix !== prefix) {
						// Checking only current prefix
						return true;
					}

					const name = icon.name;
					if (storage.icons[name] !== void 0) {
						// Loaded
						icons.loaded.push({
							prefix,
							name,
						});
					} else if (storage.missing[name] !== void 0) {
						// Missing
						icons.missing.push({
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
						removeCallback([prefix], item.id);
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
	pendingPrefixes: string[]
): IconifyIconLoaderAbort {
	// Create unique id and abort function
	const id = idCounter++;
	const abort = removeCallback.bind(null, pendingPrefixes, id);

	if (!icons.pending.length) {
		// Do not store item without pending icons and return function that does nothing
		return abort;
	}

	// Create item and store it for all pending prefixes
	const item: CallbackItem = {
		id,
		icons,
		callback,
		abort: abort,
	};

	pendingPrefixes.forEach(prefix => {
		if (callbacks[prefix] === void 0) {
			callbacks[prefix] = [];
		}
		callbacks[prefix].push(item);
	});

	return abort;
}
