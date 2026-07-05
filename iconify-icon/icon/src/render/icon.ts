import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import type { RenderedState } from '../state';
import { renderSPAN } from './span';
import { renderSVG } from './svg';

/**
 * Find icon node
 */
export function findIconElement(
	parent: Element | ShadowRoot
): HTMLElement | undefined {
	return Array.from(parent.childNodes).find((node) => {
		const tag =
			(node as HTMLElement).tagName &&
			(node as HTMLElement).tagName.toUpperCase();
		return tag === 'SPAN' || tag === 'SVG';
	}) as HTMLElement | undefined;
}

/**
 * Render icon
 */
export function renderIcon(parent: Element | ShadowRoot, state: RenderedState) {
	const iconData = state.icon.data;
	const customisations = state.customisations;

	// Render icon
	const renderData = iconToSVG(iconData, customisations);
	if (customisations.preserveAspectRatio) {
		renderData.attributes['preserveAspectRatio'] =
			customisations.preserveAspectRatio;
	}

	const mode = state.renderedMode;
	let node: Element;
	switch (mode) {
		case 'svg':
			node = renderSVG(renderData);
			break;

		default:
			node = renderSPAN(
				renderData,
				{
					...defaultIconProps,
					...iconData,
				},
				mode === 'mask'
			);
	}

	// Set element
	const oldNode = findIconElement(parent);
	if (oldNode) {
		// Replace old element
		if (node.tagName === 'SPAN' && oldNode.tagName === node.tagName) {
			// Swap style instead of whole node
			oldNode.setAttribute('style', node.getAttribute('style'));
		} else {
			parent.replaceChild(node, oldNode);
		}
	} else {
		// Add new element
		parent.appendChild(node);
	}
}
