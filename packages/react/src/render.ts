import type { SVGProps } from 'react';
import React from 'react';
import type { IconifyIcon } from '@iconify/types';
import type { FullIconCustomisations } from '@iconify/core/lib/customisations';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/core/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/core/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/core/lib/customisations/rotate';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { merge } from '@iconify/core/lib/misc/merge';
import type { IconifyIconCustomisations, IconProps, IconRef } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults: SVGProps<SVGElement> = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlnsXlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
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
 * Render icon
 */
export const render = (
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,

	// Partial properties
	props: IconProps,

	// True if icon should have vertical-align added
	inline: boolean,

	// Optional reference for SVG, extracted by React.forwardRef()
	ref?: IconRef
): JSX.Element => {
	// Get default properties
	const defaultProps = inline ? inlineDefaults : defaults;

	// Get all customisations
	const customisations = mergeCustomisations(
		defaultProps,
		props as IconifyIconCustomisations
	) as FullIconCustomisations;

	// Create style
	const style =
		typeof props.style === 'object' && props.style !== null
			? props.style
			: {};

	// Create SVG component properties
	const componentProps = merge(svgDefaults, {
		ref,
		style,
	});

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
			case 'children':
			case 'onLoad':
			case '_ref':
			case '_inline':
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

			// Color: copy to style
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
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			// Copy missing property if it does not exist in customisations
			default:
				if (defaultProps[key] === void 0) {
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
