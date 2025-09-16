import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { getIconStorage } from '../storage/storage.js';
import { loadIcons } from '../loader/queue.js';
import type { IconsData } from '../icon-lists/types.js';
import {
	toggleIconStorage,
	unsubscribeFromAllIconStorage,
} from '../storage/subscribe.js';
import { splitIconNames } from '../icon-lists/split.js';

/**
 * Load icon(s)
 *
 * Returns function that can be used to cancel loading
 */
export function loadIconsWithCallback(
	iconNames: (string | IconifyIconName)[] | IconsData<string[]>,
	callback: (loaded: string[], missing: string[], pending: string[]) => void
): () => void {
	const key = Symbol();
	let aborted = false;

	const abort = () => {
		aborted = true;
		unsubscribeFromAllIconStorage(key);
	};

	// Convert icon names to object
	const icons: IconsData<string[]> = Array.isArray(iconNames)
		? splitIconNames(iconNames)
		: iconNames;

	// Number of pending icons, -1 if not checked
	let lastPending = -1;

	// Check data, trigger callback if needed
	const check = () => {
		const loaded: string[] = [];
		const missing: string[] = [];
		const pending: string[] = [];

		for (const provider in icons) {
			const providerData = icons[provider];
			for (const prefix in providerData) {
				const names = providerData[prefix];
				if (names.length) {
					const storage = getIconStorage(provider, prefix);
					for (const name of names) {
						// Convert icon name to string
						const partialName = `${prefix}:${name}`;
						const fullName = provider
							? `@${provider}:${partialName}`
							: partialName;

						// Check if icon is loaded
						if (storage.icons[name]) {
							loaded.push(fullName);
						} else if (storage.missing.has(name)) {
							missing.push(fullName);
						} else {
							pending.push(fullName);
						}
					}
				}
			}
		}

		if (lastPending === -1 || lastPending !== pending.length) {
			// First run or pending count changed
			lastPending = pending.length;

			if (loaded.length || missing.length) {
				// Update callback
				callback(loaded, missing, pending);
			}
		}
	};

	// Check immediately
	check();

	// Check if there are icons to load
	if (lastPending > 0) {
		// Subscribe to storage
		toggleIconStorage(
			icons,
			() => {
				if (!aborted) {
					// Check for updates
					check();

					if (!lastPending) {
						// All icons loaded, unsubscribe
						abort();
					}
				}
			},
			key
		);

		// Load icons
		loadIcons(icons);
	}

	return abort;
}
