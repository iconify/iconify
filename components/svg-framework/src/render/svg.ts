import type { FullIconifyIcon } from '@iconify/utils/lib/icon/defaults';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import {
	elementDataProperty,
	IconifyElement,
	IconifyElementProps,
	IconifyElementData,
} from '../scanner/config';
import { applyClasses, iconClasses } from './classes';
import { applyStyle } from './style';

/**
 * Render icon as inline SVG
 */
export function renderInlineSVG(
	element: IconifyElement,
	props: IconifyElementProps,
	iconData: FullIconifyIcon
): IconifyElement {
	// Create placeholder. Why placeholder? innerHTML setter on SVG does not work in some environments.
	let span: HTMLSpanElement;
	try {
		span = document.createElement('span');
	} catch (err) {
		return element;
	}

	// Generate data to render
	const customisations = props.customisations;
	const renderData = iconToSVG(iconData, customisations);

	// Get old data
	const oldData = element[elementDataProperty];

	// Generate SVG
	const html = iconToHTML(replaceIDs(renderData.body), {
		'aria-hidden': 'true',
		'role': 'img',
		...renderData.attributes,
	});
	span.innerHTML = html;

	// Get SVG element
	const svg = span.childNodes[0] as IconifyElement;

	// Add attributes
	const placeholderAttributes = element.attributes;
	for (let i = 0; i < placeholderAttributes.length; i++) {
		const item = placeholderAttributes.item(i);
		const name = item.name;
		if (name !== 'class' && !svg.hasAttribute(name)) {
			svg.setAttribute(name, item.value);
		}
	}

	// Add classes
	const classesToAdd = iconClasses(props.icon);
	const addedClasses = applyClasses(
		svg,
		classesToAdd,
		new Set(oldData && oldData.addedClasses),
		element
	);

	// Update style
	const addedStyles = applyStyle(
		svg,
		customisations.inline
			? {
					'vertical-align': '-0.125em',
			  }
			: {},
		oldData && oldData.addedStyles
	);

	// Add data to element
	const newData: IconifyElementData = {
		...props,
		status: 'loaded',
		addedClasses,
		addedStyles,
	};
	svg[elementDataProperty] = newData;

	// Replace old element
	if (element.parentNode) {
		element.parentNode.replaceChild(svg, element);
	}

	return svg;
}
