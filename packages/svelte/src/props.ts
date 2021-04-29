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
	// Icon object
	icon: IconifyIcon;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;

	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;
}

/**
 * Properties for element that are mentioned in generate-icon.ts
 */
interface IconifyElementProps {
	style?: string;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps;
