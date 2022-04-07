import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import {
	elementDataProperty,
	IconifyElement,
	IconifyElementProps,
	IconifyElementData,
} from '../scanner/config';
import { applyClasses } from './classes';
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
	const renderData = iconToSVG(iconData, props.customisations);

	// Get old data
	const oldData = element[elementDataProperty];

	// Generate SVG
	const html =
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img">' +
		replaceIDs(renderData.body) +
		'</svg>';
	span.innerHTML = html;

	// Get SVG element
	const svg = span.childNodes[0] as IconifyElement;

	// Add attributes
	const svgAttributes = renderData.attributes as Record<string, string>;
	Object.keys(svgAttributes).forEach((attr) => {
		svg.setAttribute(attr, svgAttributes[attr]);
	});

	const placeholderAttributes = element.attributes;
	for (let i = 0; i < placeholderAttributes.length; i++) {
		const item = placeholderAttributes.item(i);
		const name = item.name;
		if (name !== 'class' && !svg.hasAttribute(name)) {
			svg.setAttribute(name, item.value);
		}
	}

	// Add classes
	const classesToAdd: Set<string> = new Set(['iconify']);
	const iconName = props.icon;
	['provider', 'prefix'].forEach((attr: keyof typeof iconName) => {
		if (iconName[attr]) {
			classesToAdd.add('iconify--' + iconName[attr]);
		}
	});
	const addedClasses = applyClasses(
		svg,
		classesToAdd,
		new Set(oldData && oldData.addedClasses),
		element
	);

	// Update style
	const addedStyles = applyStyle(
		svg,
		renderData.inline
			? {
					'vertical-align': '-0.125em',
			  }
			: {},
		oldData && oldData.addedStyles
	);

	// Add data to element
	const newData: IconifyElementData = {
		...props,
		isSVG: true,
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
