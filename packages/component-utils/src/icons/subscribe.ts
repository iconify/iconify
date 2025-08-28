import type { IconifyIcon } from '@iconify/types';
import { stringToIcon, type IconifyIconName } from '@iconify/utils';
import { getIconStorage } from '../storage/storage.js';
import type { IconStorage } from '../storage/types.js';
import {
	subscribeToIconStorage,
	unsubscribeFromIconStorage,
} from '../storage/subscription.js';
import { loadIcons } from '../loader/queue.js';

// Callback with icon data
type Callback = (data: IconifyIcon | null | undefined) => void;

interface Result {
	// Change icon name
	change: (iconName: string | IconifyIconName | IconifyIcon) => void;

	// Unsubscribe function
	unsubscribe: () => void;

	// Data
	data: IconifyIcon | null | undefined;
}

/**
 * Subscribe to icon data updates
 *
 * Can change icon name to watch updates for different icon
 *
 * Intended to be used with reactive frameworks to watch for icon data when name can change
 */
export function subscribeToIconData(
	iconToRender: string | IconifyIconName | IconifyIcon,
	callback: Callback
): Result {
	// Create unique subscriber
	const subscriber = Symbol();

	// Get icon name and storage
	let unsubscribed = false;
	let returned = false;
	let icon: IconifyIconName | null = null;
	let storage: IconStorage | null = null;
	let data: IconifyIcon | null | undefined;

	const setData = () => {
		if (!storage || !icon) {
			// Missing icon
			if (data !== null) {
				data = null;
				if (returned) {
					callback(null);
				}
			}
			return;
		}

		// Get data from storage
		const name = icon.name;
		const newData =
			storage.icons[name] ||
			(storage.missing.has(name) ? null : undefined);
		if (newData === undefined && !storage.pending.has(name)) {
			// Trigger loading
			loadIcons({
				[icon.provider]: {
					[icon.prefix]: [name],
				},
			});
		}

		// Update data
		if (data !== newData) {
			data = newData;
			if (returned) {
				callback(data);
			}
		}
	};

	// Change icon name to watch
	const change = (iconName: string | IconifyIconName | IconifyIcon) => {
		if (unsubscribed) {
			// Ignore
			return;
		}

		// Update storage
		if (storage) {
			unsubscribeFromIconStorage(storage, subscriber);
		}

		// Convert icon name to object
		const newIcon =
			typeof iconName === 'string'
				? stringToIcon(iconName)
				: { ...iconName };

		if (newIcon && 'body' in newIcon) {
			// Icon data as object
			icon = null;
			data = newIcon;
			storage = null;
			return;
		}

		// Icon name
		icon = newIcon;

		// Update subscriber
		if (icon) {
			storage = getIconStorage(icon.provider, icon.prefix);
			subscribeToIconStorage(storage, [icon.name], setData);
			setData();
		} else {
			storage = null;
			setData();
		}
	};
	change(iconToRender);

	// Return result
	returned = true;
	return {
		// Unubscribe
		unsubscribe: () => {
			unsubscribed = true;
			if (storage) {
				unsubscribeFromIconStorage(storage, subscriber);
			}
		},
		// Change icon name to watch
		change,
		// Icon data
		data,
	};
}
