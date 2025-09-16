import { getIconStorage, iterateIconStorage } from './storage.js';
import {
	subscribeToIconStorage,
	unsubscribeFromIconStorage,
} from './subscription.js';
import type { IconsData } from '../icon-lists/types.js';

type Callback = () => unknown;

/**
 * Unsubscribe from all icon storage updates
 */
export function unsubscribeFromAllIconStorage(key: string | symbol): void {
	iterateIconStorage((storage) => {
		unsubscribeFromIconStorage(storage, key);
	});
}

/**
 * Watch icon storage updates for specific names
 */
export function toggleIconStorage(
	names: IconsData<string[]>,
	callback: Callback,
	key?: string | symbol
): string | symbol {
	key = key || Symbol();
	for (const provider in names) {
		const prefixes = names[provider];
		for (const prefix in prefixes) {
			const icons = prefixes[prefix];
			const storage = getIconStorage(provider, prefix);
			if (icons.length) {
				subscribeToIconStorage(storage, icons, callback, key);
			} else {
				unsubscribeFromIconStorage(storage, key);
			}
		}
	}
	return key;
}
