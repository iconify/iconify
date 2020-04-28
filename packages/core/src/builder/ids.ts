/**
 * Regular expression for finding ids
 */
const regex = /\sid="(\S+)"/g;

/**
 * New random-ish prefix for ids
 */
const randomPrefix =
	'IconifyId-' +
	Date.now().toString(16) +
	'-' +
	((Math.random() * 0x1000000) | 0).toString(16) +
	'-';

/**
 * Counter for ids, increasing with every replacement
 */
let counter = 0;

/**
 * Replace multiple occurance of same string
 */
function strReplace(search: string, replace: string, subject: string): string {
	let pos = 0;

	while ((pos = subject.indexOf(search, pos)) !== -1) {
		subject =
			subject.slice(0, pos) +
			replace +
			subject.slice(pos + search.length);
		pos += replace.length;
	}

	return subject;
}

/**
 * Replace IDs in SVG output with unique IDs
 * Fast replacement without parsing XML, assuming commonly used patterns and clean XML (icon should have been cleaned up with Iconify Tools or SVGO).
 */
export function replaceIDs(
	body: string,
	prefix: string | (() => string) = randomPrefix
): string {
	// Find all IDs
	const ids: string[] = [];
	let match: RegExpExecArray | null;
	while ((match = regex.exec(body))) {
		ids.push(match[1]);
	}
	if (!ids.length) {
		return body;
	}

	// Replace with unique ids
	ids.forEach(id => {
		const newID =
			typeof prefix === 'function' ? prefix() : prefix + counter++;
		body = strReplace('="' + id + '"', '="' + newID + '"', body);
		body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
		body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
	});

	return body;
}
