import type { IconifyIcon } from '@iconify/types';
import { stringToIcon, type IconifyIconName } from '@iconify/utils';
import { getIconStorage } from '../storage/storage.js';

/**
 * Get icon data
 *
 * Returns icon data if icon is loaded, null if icon is missing, undefined if icon is unknown
 */
export function getLoadedIcon(
	iconName: string | IconifyIconName
): IconifyIcon | null | undefined {
	const icon =
		typeof iconName === 'string' ? stringToIcon(iconName) : iconName;
	if (!icon) {
		return null;
	}

	const storage = getIconStorage(icon.provider, icon.prefix);

	return (
		storage.icons[icon.name] ??
		(storage.missing.has(icon.name) ? null : undefined)
	);
}
