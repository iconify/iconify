import type { FullIconifyIcon } from '@iconify/utils/lib/icon/defaults';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';

// List of properties to apply
const monotoneProps: Record<string, string> = {
	'background-color': 'currentColor',
};

const coloredProps: Record<string, string> = {
	'background-color': 'transparent',
};

// Dynamically add common props to variables above
const propsToAdd: Record<string, string> = {
	image: 'var(--svg)',
	repeat: 'no-repeat',
	size: '100% 100%',
};
const propsToAddTo: Record<string, Record<string, string>> = {
	'-webkit-mask': monotoneProps,
	'mask': monotoneProps,
	'background': coloredProps,
};
for (const prefix in propsToAddTo) {
	const list = propsToAddTo[prefix];
	for (const prop in propsToAdd) {
		list[prefix + '-' + prop] = propsToAdd[prop];
	}
}

/**
 * Fix size: add 'px' to numbers
 */
function fixSize(value: string | undefined): string {
	return value ? value + (value.match(/^[-0-9.]+$/) ? 'px' : '') : 'inherit';
}

/**
 * Render node as <span>
 */
export function renderSPAN(
	data: IconifyIconBuildResult,
	icon: FullIconifyIcon,
	useMask: boolean
): Element {
	const node = document.createElement('span');

	// Body
	let body = data.body;
	if (body.indexOf('<a') !== -1) {
		// Animated SVG: add something to fix timing bug
		body += '<!-- ' + Date.now() + ' -->';
	}

	// Generate SVG as URL
	const renderAttribs = data.attributes;
	const html = iconToHTML(body, {
		...renderAttribs,
		width: icon.width + '',
		height: icon.height + '',
	});
	const url = svgToURL(html);

	// Generate style
	const svgStyle = node.style;
	const styles: Record<string, string> = {
		'--svg': url,
		'width': fixSize(renderAttribs.width),
		'height': fixSize(renderAttribs.height),
		...(useMask ? monotoneProps : coloredProps),
	};

	// Apply style
	for (const prop in styles) {
		svgStyle.setProperty(prop, styles[prop]);
	}

	return node;
}
