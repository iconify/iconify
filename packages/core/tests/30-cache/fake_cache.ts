import { mock, count, config, emptyList } from '../../lib/storage/browser';

/**
 * Get next icon set prefix for testing
 */
let prefixCounter = 0;
export function nextPrefix(): string {
	return 'fake-storage-' + prefixCounter++;
}

// Cache version. Bump when structure changes
export const cacheVersion = 'iconify2';

// Cache keys
export const cachePrefix = 'iconify';
export const countKey = cachePrefix + '-count';
export const versionKey = cachePrefix + '-version';

/**
 * Cache expiration
 */
export const hour = 3600000;
export const cacheExpiration = 168; // In hours

/**
 * Storage class
 */
export class Storage {
	canRead = true;
	canWrite = true;
	items: Record<string, string> = Object.create(null);

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
		this.items = Object.create(null);
	}
}

/**
 * Create fake storage, assign localStorage type
 */
export function createCache(): typeof localStorage {
	return (new Storage() as unknown) as typeof localStorage;
}

/**
 * Reset test
 *
 * @param fakeWindow
 */
export function reset(fakeWindow: Record<string, typeof localStorage>): void {
	// Replace window
	mock(fakeWindow);

	// Reset all data
	for (const key in config) {
		const attr = (key as unknown) as keyof typeof config;
		config[attr] = true;
		count[attr] = 0;
		emptyList[attr] = [];
	}
}
