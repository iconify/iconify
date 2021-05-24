import type { HTMLProps, SVGProps } from 'react';
import React from 'react';
import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import type {
	IconifyIconCustomisations as IconCustomisations,
	FullIconCustomisations,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
} from '@iconify/utils/lib/customisations';
import { defaults } from '@iconify/utils/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/utils/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { fullIcon } from '@iconify/utils/lib/icon';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { parseIconSet } from '@iconify/core/lib/icon/icon-set';

/**
 * Export types that could be used in component
 */
export {
	IconifyIcon,
	IconifyJSON,
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
	// Icon object or icon name (must be added to storage using addIcon)
	icon: IconifyIcon | string;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;

	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;
}

/**
 * React component properties: generic element for Icon component, SVG for generated component
 */
type IconifyElementProps = HTMLProps<HTMLElement>;
type IconifySVGProps = SVGProps<SVGElement>;

interface ReactRefProp {
	ref?: typeof React.createRef;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps & ReactRefProp;

/**
 * Default SVG attributes
 */
const svgDefaults: IconifySVGProps = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlnsXlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'role': 'img',
	'style': {}, // Include style if it isn't set to add verticalAlign later
};

/**
 * Default values for customisations for inline icon
 */
const inlineDefaults = { ...defaults, inline: true } as FullIconCustomisations;

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
	defaults: FullIconCustomisations,
	ref
): JSX.Element => {
	// Split properties
	const icon =
		typeof props.icon === 'string'
			? storage[props.icon]
			: typeof props.icon === 'object'
			? fullIcon(props.icon)
			: null;

	// Validate icon object
	if (
		typeof icon !== 'object' ||
		icon === null ||
		typeof icon.body !== 'string'
	) {
		return props.children
			? (props.children as JSX.Element)
			: React.createElement('span', {});
	}

	const customisations = { ...defaults, props };
	const componentProps = { ...svgDefaults };

	// Add reference
	componentProps.ref = ref;

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
				style.color = value;
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
				if (defaults[key] === void 0) {
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	const id = props.id;

	// Add icon stuff
	componentProps.dangerouslySetInnerHTML = {
		__html: replaceIDs(
			item.body,
			id ? () => id + '-' + localCounter++ : 'iconify-react-'
		),
	};
	for (let key in item.attributes) {
		componentProps[key] = item.attributes[key];
	}

	if (item.inline && style.verticalAlign === void 0) {
		style.verticalAlign = '-0.125em';
	}

	return React.createElement('svg', componentProps);
};

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = React.forwardRef((props: IconProps, ref?) =>
	component(props, defaults, ref)
);

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = React.forwardRef((props: IconProps, ref?) =>
	component(props, inlineDefaults, ref)
);

/**
 * Add icon to storage, allowing to call it by name
 *
 * @param name
 * @param data
 */
export function addIcon(name: string, data: IconifyIcon): void {
	storage[name] = fullIcon(data);
}

/**
 * Add collection to storage, allowing to call icons by name
 *
 * @param data Icon set
 * @param prefix Optional prefix to add to icon names, true if prefix from icon set should be used.
 */
export function addCollection(
	data: IconifyJSON,
	prefix?: string | boolean
): void {
	const iconPrefix: string =
		typeof prefix === 'string'
			? prefix
			: prefix !== false && typeof data.prefix === 'string'
			? data.prefix + ':'
			: '';
	parseIconSet(data, (name, icon) => {
		if (icon !== null) {
			storage[iconPrefix + name] = icon;
		}
	});
}
