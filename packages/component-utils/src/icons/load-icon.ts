import type { IconifyIcon } from '@iconify/types';
import {
	stringToIcon,
	type IconifyIconName,
} from '@iconify/utils/lib/icon/name';
import { getIconStorage } from '../storage/storage.js';
import {
	subscribeToIconStorage,
	unsubscribeFromIconStorage,
} from '../storage/subscription.js';
import { loadIcons } from '../loader/queue.js';

/**
 * Load icon
 */
export function loadIcon(
	iconName: string | IconifyIconName
): Promise<IconifyIcon | null> {
	return new Promise((resolve) => {
		const icon =
			typeof iconName === 'string' ? stringToIcon(iconName) : iconName;
		if (!icon) {
			return resolve(null);
		}

		const { provider, prefix, name } = icon;

		// Get storage
		const storage = getIconStorage(provider, prefix);

		// Check if icon already loaded or missing
		// Returns true if icon requires loading
		const check = (): true | undefined => {
			if (storage.icons[name]) {
				resolve(storage.icons[name]);
			} else if (storage.missing.has(name)) {
				resolve(null);
			} else {
				return true;
			}
		};

		if (check()) {
			// Load icon
			const subscriber = subscribeToIconStorage(storage, [name], () => {
				unsubscribeFromIconStorage(storage, subscriber);
				if (check()) {
					// Failed again??? Should not happen, but just in case...
					resolve(null);
				}
			});
			loadIcons({
				[provider]: {
					[prefix]: [name],
				},
			});
		}
	});
}
