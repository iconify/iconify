import type { IconifyDimenisons, IconifyJSON } from '@iconify/types';
import { defaultIconProps, defaultIconDimensions } from '../icon/defaults';
import type { IconifyIcon, FullIconifyIcon } from '../icon/defaults';
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
		const aliases = data.aliases;
		if (aliases && aliases[name] !== void 0) {
			const item = aliases[name];
			const result = getIcon(item.parent, iteration + 1);
			if (result) {
				return mergeIconData(result, item);
			}
			return result;
		}

		// Check if character exists
		const chars = data.chars;
		if (!iteration && chars && chars[name] !== void 0) {
			return getIcon(chars[name], iteration + 1);
		}

		return null;
	}

	const result = getIcon(name, 0);

	// Add default properties
	if (result) {
		for (const key in defaultIconDimensions) {
			if (
				result[key as keyof IconifyDimenisons] === void 0 &&
				data[key as keyof IconifyDimenisons] !== void 0
			) {
				(result as unknown as Record<string, unknown>)[key] =
					data[key as keyof IconifyDimenisons];
			}
		}
	}

	// Return icon
	return result && full
		? Object.assign({}, defaultIconProps, result)
		: result;
}
