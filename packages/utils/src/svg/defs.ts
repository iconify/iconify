interface SplitSVGDefsResult {
	defs: string;
	content: string;
}

/**
 * Extract definitions from SVG
 */
export function splitSVGDefs(content: string): SplitSVGDefsResult {
	let defs = '';
	const index = content.indexOf('<defs');
	while (index >= 0) {
		const start = content.indexOf('>', index);
		const end = content.indexOf('</defs');
		if (start === -1 || end === -1) {
			// Fail
			break;
		}
		const endEnd = content.indexOf('>', end);
		if (endEnd === -1) {
			break;
		}
		defs += content.slice(start + 1, end).trim();
		content = content.slice(0, index).trim() + content.slice(endEnd + 1);
	}

	return {
		defs,
		content,
	};
}

/**
 * Merge defs and content
 */
export function mergeDefsAndContent(defs: string, content: string): string {
	return defs ? '<defs>' + defs + '</defs>' + content : content;
}

/**
 * Wrap SVG content, without wrapping definitions
 */
export function wrapSVGContent(
	body: string,
	start: string,
	end: string
): string {
	const split = splitSVGDefs(body);
	return mergeDefsAndContent(split.defs, start + split.content + end);
}
