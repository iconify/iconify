import { splitIconNames } from '@iconify/component-utils/icon-lists/split';
import { loadIcons } from '@iconify/component-utils/loader/queue';
import { renderCSS } from '../full/status.js';

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
