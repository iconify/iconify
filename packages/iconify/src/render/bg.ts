import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import {
	elementDataProperty,
	IconifyElement,
	IconifyElementProps,
	IconifyElementData,
} from '../scanner/config';
import { applyClasses } from './classes';
import { applyStyle } from './style';

const commonProps: Record<string, string> = {
	display: 'inline-block',
};

const monotoneProps: Record<string, string> = {
	'-webkit-mask-image': 'var(--svg)',
	'-webkit-mask-repeat': 'no-repeat',
	'-webkit-mask-size': '100% 100%',
	'mask-image': 'var(--svg)',
	'mask-repeat': 'no-repeat',
	'mask-size': '100% 100%',
	'background-color': 'currentColor',
};

const coloredProps: Record<string, string> = {
	'background-image': 'var(--svg)',
	'background-repeat': 'no-repeat',
	'background-size': '100% 100%',
	'background-color': 'transparent',
};

/**
 * Render icon as inline SVG
 */
export function renderBackground(
	element: IconifyElement,
	props: IconifyElementProps,
	iconData: FullIconifyIcon
): IconifyElement {
	// Generate data to render
	const renderData = iconToSVG(iconData, {
		...props.customisations,
	});

	// Get old data
	const oldData = element[elementDataProperty];

	// Generate SVG
	const renderAttribs = renderData.attributes;
	let renderAttribsHTML = '';
	for (const attr in renderAttribs) {
		const value = (
			iconData[attr] !== void 0 ? iconData[attr] : renderAttribs[attr]
		) as string;
		renderAttribsHTML += ' ' + attr + '="' + value + '"';
	}
	const html =
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
		renderAttribsHTML +
		'>' +
		renderData.body +
		'</svg>';

	// Add classes
	const classesToAdd: Set<string> = new Set(['iconify']);
	const iconName = props.icon;
	['provider', 'prefix'].forEach((attr: keyof typeof iconName) => {
		if (iconName[attr]) {
			classesToAdd.add('iconify--' + iconName[attr]);
		}
	});
	const addedClasses = applyClasses(
		element,
		classesToAdd,
		new Set(oldData && oldData.addedClasses)
	);

	// Update style
	const isMonotone = renderData.body.indexOf('currentColor') !== -1;
	const url =
		'url("data:image/svg+xml,' +
		html
			.replace(/"/g, "'")
			.replace(/%/g, '%25')
			.replace(/#/g, '%23')
			.replace(/{/g, '%7B')
			.replace(/}/g, '%7D')
			.replace(/</g, '%3C')
			.replace(/>/g, '%3E') +
		'")';
	const newStyles: Record<string, string> = {
		'--svg': url,
		'width': renderAttribs.width,
		'height': renderAttribs.height,
		...commonProps,
		...(isMonotone ? monotoneProps : coloredProps),
	};
	if (renderData.inline) {
		newStyles['vertical-align'] = '-0.125em';
	}

	const addedStyles = applyStyle(
		element,
		newStyles,
		oldData && oldData.addedStyles
	);

	// Add data to element
	const newData: IconifyElementData = {
		...props,
		status: 'loaded',
		addedClasses,
		addedStyles,
	};
	element[elementDataProperty] = newData;

	return element;
}
