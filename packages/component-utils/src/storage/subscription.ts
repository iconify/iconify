import type { IconStorage } from './types.js';

/**
 * Unsubscribe from icon storage updates
 */
export function unsubscribeFromIconStorage(
	storage: IconStorage,
	key: string | symbol
): void {
	const index = storage.subscribers.findIndex(
		(subscriber) => subscriber.key === key
	);
	if (index !== -1) {
		storage.subscribers.splice(index, 1);
	}
}

/**
 * Subscribe to icon storage updated
 */
export function subscribeToIconStorage(
	storage: IconStorage,
	names: string[],
	callback: () => unknown,
	key?: string | symbol
): string | symbol {
	if (key) {
		// Avoid duplicate subscription
		unsubscribeFromIconStorage(storage, key);
	}

	key = key || Symbol();
	const subscriber = {
		key,
		names: new Set(names),
		callback,
	};

	storage.subscribers.push(subscriber);

	return key;
}
