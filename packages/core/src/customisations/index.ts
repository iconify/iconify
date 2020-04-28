import { merge } from '../misc/merge';

/**
 * Icon alignment
 */
export type IconifyHorizontalIconAlignment = 'left' | 'center' | 'right';
export type IconifyVerticalIconAlignment = 'top' | 'middle' | 'bottom';

/**
 * Icon size
 */
export type IconifyIconSize = null | string | number;

/**
 * Icon customisations
 */
export interface IconifyIconCustomisations {
	// Display mode
	inline?: boolean;

	// Dimensions
	width?: IconifyIconSize;
	height?: IconifyIconSize;

	// Alignment
	hAlign?: IconifyHorizontalIconAlignment;
	vAlign?: IconifyVerticalIconAlignment;
	slice?: boolean;

	// Transformations
	hFlip?: boolean;
	vFlip?: boolean;
	rotate?: number;
}

export type FullIconCustomisations = Required<IconifyIconCustomisations>;

/**
 * Default icon customisations values
 */
export const defaults: FullIconCustomisations = Object.freeze({
	// Display mode
	inline: false,

	// Dimensions
	width: null,
	height: null,

	// Alignment
	hAlign: 'center',
	vAlign: 'middle',
	slice: false,

	// Transformations
	hFlip: false,
	vFlip: false,
	rotate: 0,
});

/**
 * Convert IconifyIconCustomisations to FullIconCustomisations
 */
export function fullCustomisations(
	item: IconifyIconCustomisations
): FullIconCustomisations {
	return merge(defaults, item) as FullIconCustomisations;
}
