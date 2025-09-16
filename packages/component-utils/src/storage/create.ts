import type { IconifyIcon } from '@iconify/types';
import type { IconStorage, IconStorageSubscriber } from './types.js';
import { triggerCallbackAsync } from '../helpers/callbacks.js';

/**
 * Create icon storage
 */
export function createIconStorage(): IconStorage {
	const updated = new Set<string>();
	let updatePending = false;

	const icons = Object.create(null) as Record<string, IconifyIcon>;
	const missing = new Set<string>();
	const pending = new Set<string>();
	const subscribers: IconStorageSubscriber[] = [];

	function update(name: string, data: IconifyIcon | null) {
		// Update data
		pending.delete(name);
		if (data) {
			if (icons[name] === data) {
				return; // No change
			}
			icons[name] = data;
			missing.delete(name);
		} else {
			if (missing.has(name)) {
				return; // No change
			}
			delete icons[name];
			missing.add(name);
		}

		// Trigger update for subscribers on next tick
		updated.add(name);
		if (!updatePending) {
			updatePending = true;
			setTimeout(() => {
				updatePending = false;

				// Trigger all callbacks for subscribers
				subscribers.forEach((subscriber) => {
					for (const name of subscriber.names) {
						// Allow wildcard
						if (name === '*' || updated.has(name)) {
							triggerCallbackAsync(subscriber.callback);
							return;
						}
					}
				});
				updated.clear();
			});
		}
	}

	return {
		icons,
		missing,
		pending,
		subscribers,
		update,
	};
}
