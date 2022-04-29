import { iconToSVG } from '@iconify/utils/lib/svg/build';
import type { RenderedState } from '../state';
import { renderSPAN } from './span';
import { renderSVG } from './svg';

/**
 * Render icon
 */
export function renderIcon(parent: Element | ShadowRoot, state: RenderedState) {
	// Render icon
	const iconData = state.icon.data;
	const renderData = iconToSVG(iconData, {
		...state.customisations,
		inline: state.inline,
	});

	const mode = state.renderedMode;
	let node: Element;
	switch (mode) {
		case 'svg':
			node = renderSVG(renderData);
			break;

		default:
			node = renderSPAN(renderData, iconData, mode === 'mask');
	}

	// Set element
	// Assumes first node is a style node created with updateStyle()
	if (parent.childNodes.length > 1) {
		parent.removeChild(parent.lastChild);
	}
	parent.appendChild(node);
}
