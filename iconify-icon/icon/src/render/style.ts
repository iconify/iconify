/**
 * Attribute to add
 */
const nodeAttr = 'data-style';

/**
 * Custom style to add to each node
 */
let customStyle = '';

/**
 * Shared constructed style sheets, one per inline mode
 *
 * All components share the same two sheets instead of each component
 * owning a <style> node, which matters on pages with many icons.
 */
const sharedSheets: Partial<Record<'inline' | 'block', CSSStyleSheet>> = {};

/**
 * Parent that supports adoptedStyleSheets
 */
interface AdoptingParent {
	adoptedStyleSheets: CSSStyleSheet[];
}

/**
 * Generate style content
 */
function getStyleContent(inline: boolean): string {
	return (
		':host{display:inline-block;vertical-align:' +
		(inline ? '-0.125em' : '0') +
		'}span,svg{display:block;margin:auto}' +
		customStyle
	);
}

/**
 * Check if constructed style sheets can be used for parent
 */
function supportsAdoptedStyleSheets(
	parent: Element | ShadowRoot
): parent is (Element | ShadowRoot) & AdoptingParent {
	return (
		'adoptedStyleSheets' in parent &&
		typeof CSSStyleSheet === 'function' &&
		typeof CSSStyleSheet.prototype.replaceSync === 'function'
	);
}

/**
 * Get shared style sheet for inline mode, create if needed
 */
function getSharedSheet(inline: boolean): CSSStyleSheet {
	const key = inline ? 'inline' : 'block';
	let sheet = sharedSheets[key];
	if (!sheet) {
		sheet = sharedSheets[key] = new CSSStyleSheet();
		sheet.replaceSync(getStyleContent(inline));
	}
	return sheet;
}

/**
 * Set custom style to add to all components
 *
 * Components that share a constructed style sheet are updated immediately.
 * Components that use a <style> node are affected only if rendered after function call.
 */
export function appendCustomStyle(style: string) {
	customStyle = style;
	sharedSheets.inline?.replaceSync(getStyleContent(true));
	sharedSheets.block?.replaceSync(getStyleContent(false));
}

/**
 * Add/update style node
 */
export function updateStyle(parent: Element | ShadowRoot, inline: boolean) {
	if (supportsAdoptedStyleSheets(parent)) {
		const sheet = getSharedSheet(inline);
		const current = parent.adoptedStyleSheets;
		if (current.includes(sheet)) {
			return;
		}

		// Replace previously adopted shared sheet, keep sheets adopted by others
		parent.adoptedStyleSheets = current
			.filter(
				(item) => item !== sharedSheets.inline && item !== sharedSheets.block
			)
			.concat(sheet);
		return;
	}

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
	styleNode.textContent = getStyleContent(inline);
}
