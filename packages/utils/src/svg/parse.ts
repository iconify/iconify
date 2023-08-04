import { IconifyIconBuildResult } from './build';
import { getSVGViewBox } from './viewbox';

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
 * Extract attributes and content from SVG
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
	const attribsList = match[1].match(/[\w:-]+="[^"]*"/g);
	const attribs = Object.create(null) as Record<string, string>;
	attribsList?.forEach((row) => {
		const match = row.match(/([\w:-]+)="([^"]*)"/);
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
 * Convert parsed SVG to IconifyIconBuildResult
 */
export function buildParsedSVG(
	data: ParsedSVGContent
): IconifyIconBuildResult | undefined {
	const attribs = data.attribs;
	const viewBox = getSVGViewBox(attribs['viewBox'] ?? '');
	if (!viewBox) {
		return;
	}

	// Split presentation attributes
	const groupAttributes: string[] = [];
	for (const key in attribs) {
		if (
			key === 'style' ||
			key.startsWith('fill') ||
			key.startsWith('stroke')
		) {
			groupAttributes.push(`${key}="${attribs[key]}"`);
		}
	}

	let body = data.body;
	if (groupAttributes.length) {
		body = '<g ' + groupAttributes.join(' ') + '>' + body + '</g>';
	}

	return {
		attributes: {
			// Copy dimensions if exist
			width: attribs.width,
			height: attribs.height,
			// Merge viewBox
			viewBox: viewBox.join(' '),
		},
		viewBox,
		body,
	};
}
