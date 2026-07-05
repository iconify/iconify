import type { IconsData } from '../icon-lists/types.js';
import { createIconStorage } from './create.js';
import type { IconStorage } from './types.js';

// Storage
const storage = Object.create(null) as IconsData<IconStorage>;

/**
 * Get storage for provider and prefix
 */
export function getIconStorage(provider: string, prefix: string): IconStorage {
	const providerData =
		storage[provider] || (storage[provider] = Object.create(null));
	return providerData[prefix] || (providerData[prefix] = createIconStorage());
}

/**
 * Iterate all available icon storage
 */
export function iterateIconStorage(
	callback: (data: IconStorage, prefix: string, provider: string) => void
): void {
	for (const provider in storage) {
		const providerData = storage[provider];
		for (const prefix in providerData) {
			callback(providerData[prefix], prefix, provider);
		}
	}
}
