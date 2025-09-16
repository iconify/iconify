import type { IconifyIcon } from '@iconify/types';

/**
 * Subscriber
 */
export interface IconStorageSubscriber {
	// Unique key
	key: string | symbol;

	// Icon names
	names: Set<string>;

	// Callback to call when icon(s) are updated
	callback: () => unknown;
}

/**
 * Storage for icons
 */
export interface IconStorage {
	// Loaded icons
	icons: Readonly<Record<string, IconifyIcon>>;

	// Missing icons
	missing: Readonly<Set<string>>;

	// Pending icons
	pending: Set<string>;

	// Subscribers
	subscribers: IconStorageSubscriber[];

	// Update icon data
	update: (name: string, data: IconifyIcon | null) => void;
}
