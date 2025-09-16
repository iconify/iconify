/*
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
 * Counters
 */
const counters = new Map<string, number>();

/**
 * Get unique new ID
 */
function nextID(id: string): string {
	id = id.replace(/[0-9]+$/, '') || 'a';
	const count = counters.get(id) || 0;
	counters.set(id, count + 1);
	return count ? `${id}${count}` : id;
}

/**
 * Replace IDs in SVG output with unique IDs
 */
export function replaceIDs(body: string): string {
	// Find all IDs
	const ids: string[] = [];
	let match: RegExpExecArray | null;
	while ((match = regex.exec(body))) {
		ids.push(match[1]);
	}
	if (!ids.length) {
		return body;
	}

	// Random text to make sure there are no conflicts between old and new ids
	const suffix =
		'suffix' + ((Math.random() * 0x1000000) | Date.now()).toString(16);

	// Replace with unique ids
	ids.forEach((id) => {
		const newID = nextID(id);

		const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		body = body.replace(
			// Allowed characters before id: [#;"]
			// Allowed characters after id: [)"], .[a-z]
			new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', 'g'),
			'$1' + newID + suffix + '$3'
		);
	});
	body = body.replace(new RegExp(suffix, 'g'), '');

	return body;
}

/**
 * Clear ID cache
 */
export function clearIDCache() {
	counters.clear();
}
