import type { IconifyTransformations } from '@iconify/types';
import { defaultIconTransformations } from '../icon/defaults';

/**
 * Icon size
 */
export type IconifyIconSize = null | string | number;

/**
 * Dimensions
 */
export interface IconifyIconSizeCustomisations {
	width?: IconifyIconSize;
	height?: IconifyIconSize;
}

/**
 * Icon customisations
 */
export interface IconifyIconCustomisations
	extends IconifyTransformations,
		IconifyIconSizeCustomisations {}

export type FullIconCustomisations = Required<IconifyIconCustomisations>;

/**
 * Default icon customisations values
 */
export const defaultIconSizeCustomisations: Required<IconifyIconSizeCustomisations> =
	Object.freeze({
		width: null,
		height: null,
	});

export const defaultIconCustomisations: FullIconCustomisations = Object.freeze({
	// Dimensions
	...defaultIconSizeCustomisations,

	// Transformations
	...defaultIconTransformations,
});
