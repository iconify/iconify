/**
 * Convert IconViewBox to string
 */
export function getIconViewBox(viewBox: {
	width: number;
	height: number;
	left?: number;
	top?: number;
}): string {
	return `${viewBox.left ?? 0} ${viewBox.top ?? 0} ${viewBox.width} ${
		viewBox.height
	}`;
}
