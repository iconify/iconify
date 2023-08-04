/**
 * SVG viewBox: x, y, width, height
 */
export type SVGViewBox = [x: number, y: number, width: number, height: number];

/**
 * Get viewBox from string
 */
export function getSVGViewBox(value: string): SVGViewBox | undefined {
	const result = value.trim().split(/\s+/).map(Number);
	if (
		result.length === 4 &&
		result.reduce((prev, value) => prev && !isNaN(value), true)
	) {
		return result as SVGViewBox;
	}
}
