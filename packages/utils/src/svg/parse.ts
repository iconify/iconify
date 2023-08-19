import { IconifyIcon } from '@iconify/types';
import { IconifyIconBuildResult } from './build';
import { wrapSVGContent } from './defs';
import { SVGViewBox, getSVGViewBox } from './viewbox';

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

interface BuildResult {
	width?: string;
	height?: string;
	viewBox: SVGViewBox;
	body: string;
}

function build(data: ParsedSVGContent): BuildResult | undefined {
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
		// Wrap content in group, except for defs
		body = wrapSVGContent(
			body,
			'<g ' + groupAttributes.join(' ') + '>',
			'</g>'
		);
	}

	return {
		// Copy dimensions if exist
		width: attribs.width,
		height: attribs.height,
		viewBox,
		body,
	};
}

/**
 * Convert parsed SVG to IconifyIconBuildResult
 */
export function buildParsedSVG(
	data: ParsedSVGContent
): IconifyIconBuildResult | undefined {
	const result = build(data);
	if (result) {
		return {
			attributes: {
				// Copy dimensions if exist
				width: result.width,
				height: result.height,
				// Merge viewBox
				viewBox: result.viewBox.join(' '),
			},
			viewBox: result.viewBox,
			body: result.body,
		};
	}
}

/**
 * Convert parsed SVG to IconifyIcon
 */
export function convertParsedSVG(
	data: ParsedSVGContent
): IconifyIcon | undefined {
	const result = build(data);
	if (result) {
		const viewBox = result.viewBox;
		return {
			left: viewBox[0],
			top: viewBox[1],
			width: viewBox[2],
			height: viewBox[3],
			body: result.body,
		};
	}
}
