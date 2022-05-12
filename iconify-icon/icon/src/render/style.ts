/**
 * Add/update style node
 */
export function updateStyle(parent: Element | ShadowRoot, inline: boolean) {
	// Get node, create if needed
	let style = parent.firstChild;
	if (!style) {
		style = document.createElement('style');
		parent.appendChild(style);
	}

	// Update content
	style.textContent =
		':host{display:inline-block;vertical-align:' +
		(inline ? '-0.125em' : '0') +
		'}span,svg{display:block}';
}
