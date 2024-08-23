import type { IconifyIcon } from '@iconify/types';
import { SVGViewBox } from '../svg/viewbox';

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

/**
 * Make icon viewBox square
 */
export function makeViewBoxSquare(viewBox: SVGViewBox): SVGViewBox {
	const [left, top, width, height] = viewBox;
	if (width !== height) {
		const max = Math.max(width, height);
		return [left - (max - width) / 2, top - (max - height) / 2, max, max];
	}
	return viewBox;
}
