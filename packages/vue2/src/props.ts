import { IconifyIcon } from '@iconify/types';
import { IconifyIconCustomisations as IconCustomisations } from '@iconify/core/lib/customisations';

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
	// Icon object
	icon: IconifyIcon | string;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;
}

/**
 * Properties for element that are mentioned in render.ts
 */
interface IconifyElementProps {
	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// Style
	style?: unknown;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps;
