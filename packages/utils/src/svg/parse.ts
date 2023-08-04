/**
 * viewBox: x, y, width, height
 */
export type SVGViewBox = [number, number, number, number];

/**
 * Parsed SVG content
 */
export interface ParsedSVGContent {
	// Attributes for SVG element
	attribs: Record<string, string>;
	// Content
	body: string;
}

/**
 * Extract viewBox from SVG
 */
export function parseSVGContent(content: string): ParsedSVGContent | undefined {
	// Split SVG attributes and body
	const match = content
		.trim()
		.match(
			/(?:<(?:\?xml|!DOCTYPE)[^>]+>\s*)*<svg([^>]+)>([\s\S]+)<\/svg[^>]*>/
		);
	if (!match) {
		return;
	}
	const body = match[2].trim();

	// Split attributes
	const attribsList = match[1].match(/[\w-]+="[^"]*"/g);
	const attribs = Object.create(null) as Record<string, string>;
	attribsList?.forEach((row) => {
		const match = row.match(/([\w-]+)="([^"]*)"/);
		if (match) {
			attribs[match[1]] = match[2];
		}
	});

	return {
		attribs,
		body,
	};
}

/**
 * Get viewBox from value
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
