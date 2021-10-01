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
 * Check if character is a quote
 */
function isQuote(char: string): boolean {
	return char === '"' || char === "'";
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

	// Sort ids by length
	ids.sort((a, b) => b.length - a.length);

	// Replace with unique ids
	ids.forEach((id) => {
		const newID =
			typeof prefix === 'function' ? prefix() : prefix + counter++;

		const parts = body.split(id);
		let lastPart = parts.shift() as string;
		body = lastPart;

		parts.forEach((part) => {
			if (!part.length) {
				// Two ids in a row? Not possible
				body += id + part;
				lastPart += id + part;
				return;
			}

			const lastChar = lastPart.slice(lastPart.length - 1);
			const nextChar = part.slice(0, 1);

			// Test if characters around ID are
			function test(): boolean {
				if (lastChar === '#') {
					// xlink:href="#{id}"
					// url(#{id})
					return isQuote(nextChar) || nextChar === ')';
				}

				const isAnimationDot =
					nextChar === '.' && !!part.slice(1, 2).match(/\w/);
				if (isQuote(lastChar) || lastChar === ';') {
					// id="{id}"
					// begin="0;{id}.end" (coverts all animations)
					return isQuote(nextChar) || isAnimationDot;
				}

				return false;
			}

			const success = test();
			body += (success ? newID : id) + part;
			lastPart = part;
		});
	});

	return body;
}
