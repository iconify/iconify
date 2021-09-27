import { h } from 'vue';
import type { VNode } from 'vue';
import type { IconifyIcon } from '@iconify/types';
import type { FullIconCustomisations } from '@iconify/utils/lib/customisations';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/utils/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/utils/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import type { IconifyIconCustomisations, IconProps } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults: Record<string, unknown> = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'role': 'img',
};

/**
 * Aliases for customisations.
 * In Vue 'v-' properties are reserved, so v-align and v-flip must be renamed
 */
let customisationAliases = {};
['horizontal', 'vertical'].forEach((prefix) => {
	['Align', 'Flip'].forEach((suffix) => {
		const attr = prefix.slice(0, 1) + suffix;
		const value = {
			attr,
			boolean: suffix === 'Flip',
		};

		// vertical-align
		customisationAliases[prefix + '-' + suffix.toLowerCase()] = value;
		// v-align
		customisationAliases[prefix.slice(0, 1) + '-' + suffix.toLowerCase()] =
			value;
		// verticalAlign
		customisationAliases[prefix + suffix] = value;
	});
});

/**
 * Interface for inline style
 * Support for strings and arrays has been removed.
 */
type VStyle = Record<string, unknown>;

/**
 * Render icon
 */
export const render = (
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,

	// Partial properties
	props: IconProps
): VNode => {
	// Split properties
	const customisations = mergeCustomisations(
		defaults,
		props as IconifyIconCustomisations
	) as FullIconCustomisations;
	const componentProps = { ...svgDefaults };

	// Copy style
	let style: VStyle =
		typeof props.style === 'object' && !(props.style instanceof Array)
			? { ...props.style }
			: {};

	// Get element properties
	for (let key in props) {
		const value = props[key];
		if (value === void 0) {
			continue;
		}
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
			case 'onLoad':
				break;

			// Boolean attributes
			case 'inline':
			case 'hFlip':
			case 'vFlip':
				customisations[key] =
					value === true || value === 'true' || value === 1;
				break;

			// Flip as string: 'horizontal,vertical'
			case 'flip':
				if (typeof value === 'string') {
					flipFromString(customisations, value);
				}
				break;

			// Alignment as string
			case 'align':
				if (typeof value === 'string') {
					alignmentFromString(customisations, value);
				}
				break;

			// Color: override style
			case 'color':
				style.color = value;
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					customisations[key] = value;
				}
				break;

			// Remove aria-hidden
			case 'ariaHidden':
			case 'aria-hidden':
				// Vue transforms 'aria-hidden' property to 'ariaHidden'
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			default:
				if (customisationAliases[key] !== void 0) {
					// Aliases for customisations
					if (
						customisationAliases[key].boolean &&
						(value === true || value === 'true' || value === 1)
					) {
						// Check for boolean
						customisations[customisationAliases[key].attr] = true;
					} else if (
						!customisationAliases[key].boolean &&
						typeof value === 'string' &&
						value !== ''
					) {
						// String
						customisations[customisationAliases[key].attr] = value;
					}
				} else if (defaults[key] === void 0) {
					// Copy missing property if it does not exist in customisations
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Add icon stuff
	for (let key in item.attributes) {
		componentProps[key] = item.attributes[key];
	}

	if (
		item.inline &&
		style.verticalAlign === void 0 &&
		style['vertical-align'] === void 0
	) {
		style.verticalAlign = '-0.125em';
	}

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	const id = props.id;

	// Add innerHTML and style to props
	componentProps['innerHTML'] = replaceIDs(
		item.body,
		id ? () => id + '-' + localCounter++ : 'iconify-vue-'
	);
	if (Object.keys(style).length > 0) {
		componentProps['style'] = style;
	}

	// Render icon
	return h('svg', componentProps);
};
