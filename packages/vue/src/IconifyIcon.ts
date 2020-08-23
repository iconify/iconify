import { h, VNode } from 'vue';

import { IconifyIcon as IconifyIconData } from '@iconify/types';
import {
	IconifyIconCustomisations as IconCustomisations,
	FullIconCustomisations,
	defaults,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
} from '@iconify/core/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/core/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/core/lib/customisations/rotate';
import { fullIcon } from '@iconify/core/lib/icon';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { merge } from '@iconify/core/lib/misc/merge';

/**
 * Export types that could be used in component
 */
export type {
	IconifyIconData,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
};

// Allow rotation to be string
/**
 * Icon customisations
 */
export type IconifyIconCustomisations = IconCustomisations & {
	rotate?: string | number;
};

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	icon: IconifyIconData;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;

	// Aliases for alignment because "v-align" is treated like directive
	horizontalAlign?: IconifyHorizontalIconAlignment;
	verticalAlign?: IconifyVerticalIconAlignment;

	// Aliases for flip because "v-flip" is treated like directive
	horizontalFlip?: boolean;
	verticalFlip?: boolean;
}

/**
 * Default SVG attributes
 */
const svgDefaults = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'focusable': false,
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
		// vertical-align
		customisationAliases[prefix + '-' + suffix.toLowerCase()] = attr;
		// v-align
		customisationAliases[
			prefix.slice(0, 1) + '-' + suffix.toLowerCase()
		] = attr;
		// verticalAlign
		customisationAliases[prefix + suffix] = attr;
	});
});

/**
 * Storage for icons referred by name
 */
const storage: Record<string, Required<IconifyIconData>> = Object.create(null);

/**
 * Interface for inline style
 */
type VStyleObject = Record<string, unknown>;
interface VStyleAsString {
	type: 'string';
	style: string;
}
interface VStyleAsArray {
	type: 'array';
	style: VStyleObject[];
}
type VStyle = VStyleAsString | VStyleAsArray;

/**
 * TypeScript guard, never used
 */
function assertNever(value: never) {
	// Do nothing
}

/**
 * IconifyIcon component
 */
const IconifyIcon = (
	inline: boolean,
	props: Record<string, unknown>,
	context
): VNode => {
	const attribs = (props as unknown) as IconifyIconProps;

	// Split properties
	const icon =
		typeof attribs.icon === 'string'
			? storage[attribs.icon]
			: fullIcon(attribs.icon);
	if (!icon) {
		return null;
	}

	const customisations = merge(
		defaults,
		{ inline },
		props as IconifyIconCustomisations
	) as FullIconCustomisations;
	const componentProps = merge(svgDefaults);

	// Copy style
	let style: VStyle;
	let hasStyle = true;
	if (typeof props.style === 'string') {
		// String: copy it
		style = {
			type: 'string',
			style: props.style,
		};
	} else if (
		typeof props.style === 'object' &&
		props.style instanceof Array
	) {
		// Array of objects
		style = {
			type: 'array',
			style: props.style.slice(0),
		};
	} else if (typeof props.style === 'object' && props.style !== null) {
		// Object
		style = {
			type: 'array',
			style: [props.style as VStyleObject],
		};
	} else {
		// No style
		style = {
			type: 'string',
			style: '',
		};
		hasStyle = false;
	}

	// Get element properties
	let styleType: typeof style.type;
	for (let key in props) {
		const value = props[key];
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

			// Color: copy to style
			case 'color':
				styleType = style.type;
				switch (styleType) {
					case 'string':
						(style as VStyleAsString).style =
							'color: ' + value + '; ' + style.style;
						hasStyle = true;
						break;

					case 'array':
						(style as VStyleAsArray).style.unshift({
							color: value,
						});
						break;

					default:
						assertNever(styleType);
				}
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
				// Vue transforms 'aria-hidden' property to 'ariaHidden'
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			default:
				if (customisationAliases[key] !== void 0) {
					// Aliases for customisations
					customisations[customisationAliases[key]] = value;
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

	if (item.inline) {
		styleType = style.type;
		switch (styleType) {
			case 'string':
				(style as VStyleAsString).style =
					'vertical-align: -0.125em; ' + style.style;
				hasStyle = true;
				break;

			case 'array':
				(style as VStyleAsArray).style.unshift({
					verticalAlign: '-0.125em',
				});
				break;

			default:
				assertNever(styleType);
		}
	}

	// Add innerHTML and style to props
	componentProps['innerHTML'] = replaceIDs(item.body);
	if (hasStyle) {
		componentProps['style'] = style.style;
	}

	// Render icon
	return h('svg', componentProps);
};

// Export component
export const Icon = IconifyIcon.bind(null, false);
export const InlineIcon = IconifyIcon.bind(null, true);

/**
 * Add icon to storage
 */
export function addIcon(name: string, data: IconifyIconData) {
	storage[name] = fullIcon(data);
}
