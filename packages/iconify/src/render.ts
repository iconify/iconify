import { PlaceholderElement } from './finder';
import { FullIconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconCustomisations,
	fullCustomisations,
} from '@iconify/core/lib/customisations';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import {
	IconifyElement,
	IconifyElementData,
	elementDataProperty,
	elementFinderProperty,
} from './element';

/**
 * Replace element with SVG
 */
export function renderIcon(
	placeholder: PlaceholderElement,
	customisations: IconifyIconCustomisations,
	iconData: FullIconifyIcon
): IconifyElement | null {
	const data = iconToSVG(iconData, fullCustomisations(customisations));

	// Get class name
	const placeholderElement = placeholder.element;
	const placeholderClassName = placeholderElement.getAttribute('class');
	const filteredClassList = placeholder.finder.classFilter(
		placeholderClassName ? placeholderClassName.split(/\s+/) : []
	);
	const className =
		'iconify iconify--' +
		placeholder.name.prefix +
		(filteredClassList.length ? ' ' + filteredClassList.join(' ') : '');

	// Generate SVG as string
	const html =
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" class="' +
		className +
		'">' +
		replaceIDs(data.body) +
		'</svg>';

	// Create placeholder. Why placeholder? IE11 doesn't support innerHTML method on SVG.
	const span = document.createElement('span');
	span.innerHTML = html;

	// Get SVG element
	const svg = span.childNodes[0] as IconifyElement;
	const svgStyle = svg.style;

	// Add attributes
	const svgAttributes = data.attributes as Record<string, string>;
	Object.keys(svgAttributes).forEach((attr) => {
		svg.setAttribute(attr, svgAttributes[attr]);
	});

	// Add custom styles
	svgStyle.transform = 'rotate(360deg)';
	if (data.inline) {
		svgStyle.verticalAlign = '-0.125em';
	}

	// Copy attributes from placeholder
	const placeholderAttributes = placeholderElement.attributes;
	for (let i = 0; i < placeholderAttributes.length; i++) {
		const item = placeholderAttributes.item(i);
		if (item) {
			const name = item.name;
			if (
				name !== 'class' &&
				name !== 'style' &&
				svgAttributes[name] === void 0
			) {
				try {
					svg.setAttribute(name, item.value);
				} catch (err) {}
			}
		}
	}

	// Copy styles from placeholder
	const placeholderStyle = placeholderElement.style;
	for (let i = 0; i < placeholderStyle.length; i++) {
		const attr = placeholderStyle[i];
		svgStyle[attr] = placeholderStyle[attr];
	}

	// Store data
	const elementData: IconifyElementData = {
		name: placeholder.name,
		status: 'loaded',
		customisations: customisations,
	};
	svg[elementDataProperty] = elementData;
	svg[elementFinderProperty] = placeholder.finder;

	// Replace placeholder
	if (placeholderElement.parentNode) {
		placeholderElement.parentNode.replaceChild(svg, placeholderElement);
	} else {
		// Placeholder has no parent? Remove SVG parent as well
		span.removeChild(svg);
	}

	// Return new node
	return svg;
}
