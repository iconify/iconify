import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from './icons';
import { getStorage } from '../storage/storage';
import type { SortedIcons } from '../icon/sort';
import type { IconifyIconSource } from '@iconify/utils/lib/icon/name';

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

// Records sorted by provider and prefix
// This export is only for unit testing, should not be used
export const callbacks: Record<
	string,
	Record<string, CallbackItem[]>
> = Object.create(null);
const pendingUpdates: Record<string, Record<string, boolean>> = Object.create(
	null
);

/**
 * Remove callback
 */
function removeCallback(sources: IconifyIconSource[], id: number): void {
	sources.forEach((source) => {
		const provider = source.provider;
		if (callbacks[provider] === void 0) {
			return;
		}
		const providerCallbacks = callbacks[provider];

		const prefix = source.prefix;
		const items = providerCallbacks[prefix];
		if (items) {
			providerCallbacks[prefix] = items.filter((row) => row.id !== id);
		}
	});
}

/**
 * Update all callbacks for provider and prefix
 */
export function updateCallbacks(provider: string, prefix: string): void {
	if (pendingUpdates[provider] === void 0) {
		pendingUpdates[provider] = Object.create(null);
	}
	const providerPendingUpdates = pendingUpdates[provider];

	if (!providerPendingUpdates[prefix]) {
		providerPendingUpdates[prefix] = true;
		setTimeout(() => {
			providerPendingUpdates[prefix] = false;

			if (
				callbacks[provider] === void 0 ||
				callbacks[provider][prefix] === void 0
			) {
				return;
			}

			// Get all items
			const items = callbacks[provider][prefix].slice(0);
			if (!items.length) {
				return;
			}

			const storage = getStorage(provider, prefix);

			// Check each item for changes
			let hasPending = false;
			items.forEach((item: CallbackItem) => {
				const icons = item.icons;
				const oldLength = icons.pending.length;
				icons.pending = icons.pending.filter((icon) => {
					if (icon.prefix !== prefix) {
						// Checking only current prefix
						return true;
					}

					const name = icon.name;
					if (storage.icons[name] !== void 0) {
						// Loaded
						icons.loaded.push({
							provider,
							prefix,
							name,
						});
					} else if (storage.missing[name] !== void 0) {
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
						removeCallback(
							[
								{
									provider,
									prefix,
								},
							],
							item.id
						);
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
	pendingSources: IconifyIconSource[]
): IconifyIconLoaderAbort {
	// Create unique id and abort function
	const id = idCounter++;
	const abort = removeCallback.bind(null, pendingSources, id);

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

	pendingSources.forEach((source) => {
		const provider = source.provider;
		const prefix = source.prefix;
		if (callbacks[provider] === void 0) {
			callbacks[provider] = Object.create(null);
		}
		const providerCallbacks = callbacks[provider];
		if (providerCallbacks[prefix] === void 0) {
			providerCallbacks[prefix] = [];
		}
		providerCallbacks[prefix].push(item);
	});

	return abort;
}
