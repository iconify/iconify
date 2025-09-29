import { calculateSize } from '@iconify/utils/lib/svg/size';

interface Size {
	width: string | undefined;
	height: string | undefined;
	viewBox: string;
}

/**
 * Get size properties for icon
 */
export function getSizeProps(
	width: string | undefined,
	height: string | undefined,
	iconViewBox: { width: number; height: number; left?: number; top?: number }
): Size {
	const viewBox = `${iconViewBox.left || 0} ${iconViewBox.top || 0} ${
		iconViewBox.width
	} ${iconViewBox.height}`;

	if ((!width && !height) || (width && height)) {
		// None or both sizes are set
		// Empty value = undefined
		return {
			viewBox,
			width: width || undefined,
			height: height || undefined,
		};
	}

	// One size is set
	const iconWidth = iconViewBox.width;
	const iconHeight = iconViewBox.height;
	if (width) {
		// Set height based on width
		return {
			viewBox,
			width,
			height: width
				? calculateSize(width, iconHeight / iconWidth)
				: undefined,
		};
	}

	// Set width based on height
	return {
		viewBox,
		height,
		width: height
			? calculateSize(height, iconWidth / iconHeight)
			: undefined,
	};
}
