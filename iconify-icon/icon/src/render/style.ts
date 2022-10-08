/**
 * Attribute to add
 */
const nodeAttr = 'data-style';

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
		'}span,svg{display:block}';
}
