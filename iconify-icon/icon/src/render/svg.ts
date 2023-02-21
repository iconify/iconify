import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { iconToHTML } from '@iconify/utils/lib/svg/html';

/**
 * Render node as <svg>
 */
export function renderSVG(data: IconifyIconBuildResult): Element {
	const node = document.createElement('span');

	// Add style if needed
	const attr = data.attributes as Record<string, string>;
	let style = '';
	if (!attr.width) {
		style = 'width: inherit;';
	}
	if (!attr.height) {
		style += 'height: inherit;';
	}
	if (style) {
		attr.style = style;
	}

	// Generate SVG
	node.innerHTML = iconToHTML(data.body, attr);
	return node.firstChild as HTMLElement;
}
