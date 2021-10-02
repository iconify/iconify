/**
 * IDs usage:
 *
 * id="{id}"
 * xlink:href="#{id}"
 * url(#{id})
 *
 * From SVG animations:
 *
 * begin="0;{id}.end"
 * begin="{id}.end"
 * begin="{id}.click"
 */

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
 * Replace IDs in SVG output with unique IDs
 */
export function replaceIDs(
	body: string,
	prefix: string | ((id: string) => string) = randomPrefix
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
			typeof prefix === 'function' ? prefix(id) : prefix + counter++;

		const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		body = body.replace(
			// Allowed characters before id: [#;"]
			// Allowed characters after id: [)"], .[a-z]
			new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', 'g'),
			'$1' + newID + '$3'
		);
	});

	return body;
}
