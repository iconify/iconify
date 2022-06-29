import { browserStorageConfig } from './data';
import type { BrowserStorageInstance, BrowserStorageType } from './types';

/**
 * Fake window for unit testing
 */
type FakeWindow = Record<string, BrowserStorageInstance>;

let _window: FakeWindow =
	typeof window === 'undefined' ? {} : (window as unknown as FakeWindow);

/**
 * Get browser storage
 */
export function getBrowserStorage(
	key: BrowserStorageType
): BrowserStorageInstance | undefined {
	const attr = key + 'Storage';
	try {
		if (
			_window &&
			_window[attr] &&
			typeof _window[attr].length === 'number'
		) {
			return _window[attr];
		}
	} catch (err) {
		//
	}

	// Failed - mark as disabled
	browserStorageConfig[key] = false;
}

/**
 * Mock window for unit testing
 */
export function mockWindow(fakeWindow: FakeWindow): void {
	_window = fakeWindow;
}
