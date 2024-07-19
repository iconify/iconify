/**
 * Attribute to add
 */
const nodeAttr = 'data-style';

/**
 * Custom style to add to each node
 */
let customStyle = '';

/**
 * Set custom style to add to all components
 *
 * Affects only components rendered after function call
 */
export function appendCustomStyle(style: string) {
	customStyle = style;
}

/**
 * Add/update style node
 */
export function updateStyle(parent: Element | ShadowRoot, inline: boolean) {
	// Get node, create if needed
	let styleNode = Array.from(parent.childNodes).find(
		(node) =>
			(node as HTMLElement).hasAttribute &&
			(node as HTMLElement).hasAttribute(nodeAttr)
	) as HTMLElement | undefined;

	if (!styleNode) {
		styleNode = document.createElement('style');
		styleNode.setAttribute(nodeAttr, nodeAttr);
		parent.appendChild(styleNode);
	}

	// Update content
	styleNode.textContent =
		':host{display:inline-block;vertical-align:' +
		(inline ? '-0.125em' : '0') +
		'}span,svg{display:block;margin:auto}' +
		customStyle;
}
