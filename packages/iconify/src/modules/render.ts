import { FullIconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconCustomisations,
	mergeCustomisations,
	defaults,
} from '@iconify/core/lib/customisations';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { PlaceholderElement } from './finder';
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
	iconData: FullIconifyIcon,
	returnString?: boolean
): IconifyElement | string | null {
	// Create placeholder. Why placeholder? IE11 doesn't support innerHTML method on SVG.
	let span: HTMLSpanElement;
	try {
		span = document.createElement('span');
	} catch (err) {
		return returnString ? '' : null;
	}

	const data = iconToSVG(
		iconData,
		mergeCustomisations(defaults, customisations)
	);

	// Placeholder properties
	const placeholderElement = placeholder.element;
	const finder = placeholder.finder;
	const name = placeholder.name;

	// Get class name
	const placeholderClassName = placeholderElement
		? placeholderElement.getAttribute('class')
		: '';
	const filteredClassList = finder
		? finder.classFilter(
				placeholderClassName ? placeholderClassName.split(/\s+/) : []
		  )
		: [];
	const className =
		'iconify iconify--' +
		name.prefix +
		(name.provider === '' ? '' : ' iconify--' + name.provider) +
		(filteredClassList.length ? ' ' + filteredClassList.join(' ') : '');

	// Generate SVG as string
	const html =
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="' +
		className +
		'">' +
		replaceIDs(data.body) +
		'</svg>';

	// Set HTML for placeholder
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
	if (data.inline) {
		svgStyle.verticalAlign = '-0.125em';
	}

	// Copy stuff from placeholder
	if (placeholderElement) {
		// Copy attributes
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

		// Copy styles
		const placeholderStyle = placeholderElement.style;
		for (let i = 0; i < placeholderStyle.length; i++) {
			const attr = placeholderStyle[i];
			svgStyle[attr] = placeholderStyle[attr];
		}
	}

	// Store finder specific data
	if (finder) {
		const elementData: IconifyElementData = {
			name: name,
			status: 'loaded',
			customisations: customisations,
		};
		svg[elementDataProperty] = elementData;
		svg[elementFinderProperty] = finder;
	}

	// Get result
	const result = returnString ? span.innerHTML : svg;

	// Replace placeholder
	if (placeholderElement && placeholderElement.parentNode) {
		placeholderElement.parentNode.replaceChild(svg, placeholderElement);
	} else {
		// Placeholder has no parent? Remove SVG parent as well
		span.removeChild(svg);
	}

	// Return new node
	return result;
}
