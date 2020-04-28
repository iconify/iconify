import { HTMLProps, SVGProps, createElement } from 'react';
import { IconifyIcon } from '@iconify/types';
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
export {
	IconifyIcon,
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
	icon: IconifyIcon;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;
}

/**
 * React component properties: generic element for Icon component, SVG for generated component
 */
type IconifyElementProps = HTMLProps<HTMLElement>;
type IconifySVGProps = SVGProps<SVGElement>;

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps;

/**
 * Default SVG attributes
 */
const svgDefaults: IconifySVGProps = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlnsXlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'focusable': false,
	'role': 'img',
	'style': {}, // Include style if it isn't set to add verticalAlign later
};

/**
 * Default values for customisations for inline icon
 */
const inlineDefaults = merge(defaults, {
	inline: true,
} as IconifyIconCustomisations) as FullIconCustomisations;

/**
 * Storage for icons referred by name
 */
const storage: Record<string, Required<IconifyIcon>> = Object.create(null);

/**
 * Icon component
 *
 * @param props Component properties
 * @param defaults Default values for customisations (defaults or inlineDefaults)
 */
const component = (
	props: IconProps,
	defaults: FullIconCustomisations
): JSX.Element => {
	// Split properties
	const icon =
		typeof props.icon === 'string'
			? storage[props.icon]
			: fullIcon(props.icon);
	if (!icon) {
		return null;
	}

	const customisations = merge(
		defaults,
		props as IconifyIconCustomisations
	) as FullIconCustomisations;
	const componentProps = merge(svgDefaults);

	// Create style if missing
	const style = typeof props.style === 'object' ? props.style : {};
	componentProps.style = style;

	// Get element properties
	for (let key in props) {
		const value = props[key];
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
				break;

			// Flip as string: 'horizontal,vertical'
			case 'flip':
				flipFromString(customisations, value);
				break;

			// Alignment as string
			case 'align':
				alignmentFromString(customisations, value);
				break;

			// Color: copy to style
			case 'color':
				style.color = value;
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value !== 'number') {
					customisations[key] = rotateFromString(value);
				} else {
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
				if (defaults[key] === void 0) {
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Add icon stuff
	componentProps.dangerouslySetInnerHTML = { __html: replaceIDs(item.body) };
	for (let key in item.attributes) {
		componentProps[key] = item.attributes[key];
	}

	if (item.inline && style.verticalAlign === void 0) {
		style.verticalAlign = '-0.125em';
	}

	return createElement('svg', componentProps);
};

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = (props: IconProps) => component(props, defaults);

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = (props: IconProps) =>
	component(props, inlineDefaults);

/**
 * Add icon to storage, allowing to call it by name
 *
 * @param name
 * @param data
 */
export function addIcon(name: string, data: IconifyIcon): void {
	storage[name] = fullIcon(data);
}
