import { calculateSize } from '@iconify/utils/lib/svg/size';
import { getIconViewBox } from './viewbox.js';

interface Size {
	width?: string;
	height?: string;
	viewBox?: string;
}

interface ViewBox {
	width: number;
	height: number;
	left?: number;
	top?: number;
}

/**
 * Get size properties for icon
 */
export function getSizeProps(
	width: string | undefined,
	height: string | undefined,
	ratio: number | ViewBox
): Size {
	const viewBox =
		typeof ratio === 'object' ? getIconViewBox(ratio) : undefined;
	const ratioValue =
		typeof ratio === 'number' ? ratio : ratio.width / ratio.height;

	if (width && height) {
		return { width, height, viewBox };
	}
	if (height) {
		return {
			width: calculateSize(height, ratioValue),
			height,
			viewBox,
		};
	}
	if (width) {
		return {
			width,
			height: calculateSize(width, 1 / ratioValue),
			viewBox,
		};
	}
	return { viewBox };
}
