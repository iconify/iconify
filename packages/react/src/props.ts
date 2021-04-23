import type { HTMLProps, RefObject } from 'react';
import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconCustomisations as IconCustomisations } from '@iconify/core/lib/customisations';

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
	// Icon object or icon name (must be added to storage using addIcon for offline package)
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

export type IconRef = RefObject<SVGElement>;

export interface ReactRefProp {
	ref?: IconRef;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps & ReactRefProp;
