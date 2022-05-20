import type { IconifyIcon } from '@iconify/types';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import type { RenderedState } from '../state';
import { renderSPAN } from './span';
import { renderSVG } from './svg';

// viewBox properties order
const viewBoxProps: (keyof IconifyIcon)[] = ['left', 'top', 'width', 'height'];

/**
 * Render icon
 */
export function renderIcon(parent: Element | ShadowRoot, state: RenderedState) {
	const iconData = {
		...state.icon.data,
	};
	const customisations = state.customisations;

	// Custom viewBox
	const viewBox = customisations.viewBox;
	if (viewBox) {
		const parts = viewBox.split(/\s+/);
		const customisedViewBox: Partial<IconifyIcon> = {};
		let failed = false;
		if (parts.length === 4) {
			for (let i = 0; i < 4; i++) {
				const num = parseFloat(parts[i]);
				if (isNaN(num)) {
					failed = true;
				} else {
					customisedViewBox[viewBoxProps[i] as 'left'] = num;
				}
			}

			if (!failed) {
				Object.assign(iconData, customisedViewBox);
			}
		}
	}

	// Render icon
	const renderData = iconToSVG(iconData, {
		...state.customisations,
		inline: state.inline,
	});
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
			node = renderSPAN(renderData, iconData, mode === 'mask');
	}

	// Set element
	// Assumes first node is a style node created with updateStyle()
	if (parent.childNodes.length > 1) {
		const lastChild = parent.lastChild as HTMLElement;
		if (node.tagName === 'SPAN' && lastChild.tagName === node.tagName) {
			// Swap style instead of whole node
			lastChild.setAttribute('style', node.getAttribute('style'));
		} else {
			parent.replaceChild(node, lastChild);
		}
	} else {
		parent.appendChild(node);
	}
}
