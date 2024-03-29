/**
 * Generate <svg>
 */
export function iconToHTML(
	body: string,
	attributes: Record<string, string>
): string {
	let renderAttribsHTML =
		body.indexOf('xlink:') === -1
			? ''
			: ' xmlns:xlink="http://www.w3.org/1999/xlink"';
	for (const attr in attributes) {
		renderAttribsHTML += ' ' + attr + '="' + attributes[attr] + '"';
	}
	return (
		'<svg xmlns="http://www.w3.org/2000/svg"' +
		renderAttribsHTML +
		'>' +
		body +
		'</svg>'
	);
}
