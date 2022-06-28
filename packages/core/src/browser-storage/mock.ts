import { mockWindow } from './global';
import {
	browserStorageItemsCount,
	browserStorageConfig,
	browserStorageEmptyItems,
	setBrowserStorageStatus,
} from './data';

/**
 * Get next icon set prefix for testing
 */
let prefixCounter = 0;
export function nextPrefix(): string {
	return 'fake-storage-' + (prefixCounter++).toString();
}

/**
 * Storage class
 */
export class Storage {
	canRead = true;
	canWrite = true;
	items = Object.create(null) as Record<string, string>;

	/**
	 * Get number of items
	 */
	get length(): number {
		if (!this.canRead) {
			throw new Error('Restricted storage');
		}
		return Object.keys(this.items).length;
	}

	/**
	 * Get item
	 *
	 * @param name
	 */
	getItem(name: string): string | null {
		if (!this.canRead) {
			throw new Error('Restricted storage');
		}
		return this.items[name] === void 0 ? null : this.items[name];
	}

	/**
	 * Set item
	 *
	 * @param name
	 * @param value
	 */
	setItem(name: string, value: string): void {
		if (!this.canWrite) {
			throw new Error('Read-only storage');
		}
		this.items[name] = value;
	}

	/**
	 * Remove item
	 *
	 * @param name
	 */
	removeItem(name: string): void {
		if (!this.canWrite) {
			throw new Error('Read-only storage');
		}
		delete this.items[name];
	}

	/**
	 * Clear everything
	 */
	clear(): void {
		if (!this.canWrite) {
			throw new Error('Read-only storage');
		}
		this.items = Object.create(null) as Record<string, string>;
	}
}

/**
 * Create fake storage, assign localStorage type
 */
export function createCache(): typeof localStorage {
	return new Storage() as unknown as typeof localStorage;
}

/**
 * Reset test
 *
 * @param fakeWindow
 */
export function reset(fakeWindow: Record<string, typeof localStorage>): void {
	// Replace window
	mockWindow(fakeWindow);

	// Reset all data
	setBrowserStorageStatus(false);
	for (const key in browserStorageConfig) {
		const attr = key as unknown as keyof typeof browserStorageConfig;
		browserStorageConfig[attr] = true;
		browserStorageItemsCount[attr] = 0;
		browserStorageEmptyItems[attr] = [];
	}
}
