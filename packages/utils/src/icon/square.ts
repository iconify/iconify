import type { IconifyIcon } from '@iconify/types';

/**
 * Make icon square
 */
export function makeIconSquare(
	icon: Required<IconifyIcon>
): Required<IconifyIcon> {
	if (icon.width !== icon.height) {
		// Change viewBox
		const max = Math.max(icon.width, icon.height);
		return {
			...icon,
			width: max,
			height: max,
			left: icon.left - (max - icon.width) / 2,
			top: icon.top - (max - icon.height) / 2,
		};
	}
	return icon;
}
