/**
 * Generate HTML
 */
export function generateHTML(
	props: Record<string, string>,
	body: string
): string {
	let renderAttribsHTML = '';
	for (const attr in props) {
		renderAttribsHTML += ' ' + attr + '="' + props[attr] + '"';
	}
	return (
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
		renderAttribsHTML +
		'>' +
		body +
		'</svg>'
	);
}
