import type { IconifyIcon } from '@iconify/types';
import { defaults } from '@iconify/core/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/core/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/core/lib/customisations/rotate';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { merge } from '@iconify/core/lib/misc/merge';
import type { IconProps } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'role': 'img',
};

/**
 * Result
 */
export interface RenderResult {
	attributes: Record<string, unknown>;
	body: string;
}

/**
 * Generate icon from properties
 */
export function render(
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,
	// Properties
	props: IconProps
): RenderResult {
	const customisations = merge(defaults, props as typeof defaults);
	const componentProps = merge(svgDefaults) as Record<string, unknown>;

	// Create style if missing
	let style = typeof props.style === 'string' ? props.style : '';

	// Get element properties
	for (let key in props) {
		const value = props[key as keyof typeof props] as unknown;
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
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

			// Color: copy to style, add extra ';' in case style is missing it
			case 'color':
				style =
					style +
					(style.length > 0 && style.trim().slice(-1) !== ';'
						? ';'
						: '') +
					'color: ' +
					value +
					'; ';
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					componentProps[key] = value;
				}
				break;

			// Remove aria-hidden
			case 'ariaHidden':
			case 'aria-hidden':
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			// Copy missing property if it does not exist in customisations
			default:
				if ((defaults as Record<string, unknown>)[key] === void 0) {
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Add icon stuff
	for (let key in item.attributes) {
		componentProps[key] =
			item.attributes[key as keyof typeof item.attributes];
	}

	if (item.inline) {
		// Style overrides it
		style = 'vertical-align: -0.125em; ' + style;
	}

	// Style
	if (style !== '') {
		componentProps.style = style;
	}

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	const id = props.id;

	// Generate HTML
	return {
		attributes: componentProps,
		body: replaceIDs(
			item.body,
			id ? () => id + '-' + localCounter++ : 'iconify-svelte-'
		),
	};
}
