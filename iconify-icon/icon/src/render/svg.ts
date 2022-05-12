import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { iconToHTML } from '@iconify/utils/lib/svg/html';

/**
 * Render node as <svg>
 */
export function renderSVG(data: IconifyIconBuildResult): Element {
	const node = document.createElement('span');

	// Generate SVG
	node.innerHTML = iconToHTML(data.body, data.attributes);
	return node.firstChild as HTMLElement;
}
