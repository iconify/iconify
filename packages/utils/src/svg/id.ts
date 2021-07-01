/**
 * Regular expression for finding ids
 */
const regex = /\sid="(\S+)"/g;

/**
 * Match for allowed characters before and after id in replacement, including () for group
 */
const replaceValue = '([^A-Za-z0-9_-])';

/**
 * Escape value for 'new RegExp()'
 */
function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

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
	ids.forEach((id) => {
		const newID =
			typeof prefix === 'function' ? prefix() : prefix + counter++;

		body = body.replace(
			new RegExp(
				replaceValue + '(' + escapeRegExp(id) + ')' + replaceValue,
				'g'
			),
			'$1' + newID + '$3'
		);
	});

	return body;
}
