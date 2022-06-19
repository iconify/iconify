import type { FullIconifyIcon } from '@iconify/utils/lib/icon/defaults';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';
import {
	elementDataProperty,
	IconifyElement,
	IconifyElementProps,
	IconifyElementData,
} from '../scanner/config';
import { applyClasses, iconClasses } from './classes';
import { applyStyle } from './style';

const commonProps: Record<string, string> = {
	display: 'inline-block',
};

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
function fixSize(value: string): string {
	return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
}

/**
 * Render icon as inline SVG
 */
export function renderBackground(
	element: IconifyElement,
	props: IconifyElementProps,
	iconData: FullIconifyIcon,
	useMask: boolean
): IconifyElement {
	// Generate data to render
	const customisations = props.customisations;
	const renderData = iconToSVG(iconData, customisations);
	const renderAttribs = renderData.attributes;

	// Get old data
	const oldData = element[elementDataProperty];

	// Generate SVG
	const html = iconToHTML(renderData.body, {
		...renderAttribs,
		width: iconData.width + '',
		height: iconData.height + '',
	});

	// Add classes
	const classesToAdd = iconClasses(props.icon);
	const addedClasses = applyClasses(
		element,
		classesToAdd,
		new Set(oldData && oldData.addedClasses)
	);

	// Update style
	const url = svgToURL(html);
	const newStyles: Record<string, string> = {
		'--svg': url,
		'width': fixSize(renderAttribs.width),
		'height': fixSize(renderAttribs.height),
		...commonProps,
		...(useMask ? monotoneProps : coloredProps),
	};
	if (customisations.inline) {
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
