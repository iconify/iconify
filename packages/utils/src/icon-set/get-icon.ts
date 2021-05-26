import type { IconifyJSON } from '@iconify/types';
import { fullIcon, IconifyIcon, FullIconifyIcon } from '../icon';
import { mergeIconData } from '../icon/merge';

/**
 * Get data for icon
 */
export function getIconData(
	data: IconifyJSON,
	name: string,
	full: true
): FullIconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full: false
): IconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full = false
): FullIconifyIcon | IconifyIcon | null {
	function getIcon(name: string, iteration: number): IconifyIcon | null {
		if (data.icons[name] !== void 0) {
			// Return icon
			return Object.assign({}, data.icons[name]);
		}

		// Check loop
		if (iteration > 5) {
			return null;
		}

		// Check if alias exists
		if (data.aliases?.[name] !== void 0) {
			const item = data.aliases?.[name];
			const result = getIcon(item.parent, iteration + 1);
			if (result) {
				mergeIconData(result, item);
			}
			return result;
		}

		// Check if character exists
		if (iteration === 0 && data.chars?.[name] !== void 0) {
			return getIcon(data.chars?.[name], iteration + 1);
		}

		return null;
	}

	const result = getIcon(name, 0);
	return result && full ? fullIcon(result) : result;
}
