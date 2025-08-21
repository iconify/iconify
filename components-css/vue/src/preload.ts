import { splitIconNames } from '@iconify/component-utils/lib/icon-lists/split.js';
import { loadIcons } from '@iconify/component-utils/lib/loader/queue.js';
import { renderCSS } from './status.js';

/**
 * Preload icons used in fallback mode
 *
 * Icons are preloaded only if fallback mode is used
 */
export function preloadIcons(iconNames: string[]) {
	if (!renderCSS) {
		const names = splitIconNames(iconNames);
		loadIcons(names, true);
	}
}
