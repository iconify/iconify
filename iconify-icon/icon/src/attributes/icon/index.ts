import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon } from '@iconify/utils/lib/icon/name';
import { getIconData } from '@iconify/core/lib/storage/functions';
import { loadIcons } from '@iconify/core/lib/api/icons';
import { testIconObject } from './object';
import type { CurrentIconData } from './state';

/**
 * Callback
 */
export type IconOnLoadCallback = (
	value: unknown,
	name: IconifyIconName,
	data?: IconifyIcon | null
) => void;

/**
 * Parse icon value, load if needed
 */
export function parseIconValue(
	value: unknown,
	onload: IconOnLoadCallback
): CurrentIconData {
	// Check if icon name is valid
	const name =
		typeof value === 'string' ? stringToIcon(value, true, true) : null;
	if (!name) {
		// Test for serialised object
		const data = testIconObject(value);
		return {
			value,
			data,
		};
	}

	// Valid icon name: check if data is available
	const data = getIconData(name);

	// Icon data exists or icon has no prefix. Do not load icon from API if icon has no prefix
	if (data !== void 0 || !name.prefix) {
		return {
			value,
			name,
			data, // could be 'null' -> icon is missing
		};
	}

	// Load icon
	const loading = loadIcons([name], () =>
		onload(value, name, getIconData(name))
	);

	return {
		value,
		name,
		loading,
	};
}
