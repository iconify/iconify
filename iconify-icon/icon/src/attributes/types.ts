import type { IconifyIcon } from '@iconify/types';

/**
 * SVG attributes that can be overwritten
 */
export interface IconifyIconSVGAttributes {
	preserveAspectRatio: string;
}

/**
 * Icon render modes
 *
 * 'bg' = SPAN with style using `background`
 * 'mask' = SPAN with style using `mask`
 * 'svg' = SVG
 */
export type ActualRenderMode = 'bg' | 'mask' | 'svg';

/**
 * Extra render modes
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 */
export type IconifyRenderMode = 'style' | ActualRenderMode;

/**
 * Icon customisations
 */
export type IconifyIconCustomisationProperties = {
	// Dimensions
	width?: string | number;
	height?: string | number;

	// Transformations
	rotate?: string | number;
	flip?: string;
};

/**
 * All properties
 */
export interface IconifyIconProperties
	extends IconifyIconCustomisationProperties,
		Partial<IconifyIconSVGAttributes> {
	// Icon to render: name, object or serialised object
	icon: string | IconifyIcon;

	// Render mode
	mode?: IconifyRenderMode;

	// Inline mode
	inline?: boolean;

	// Do not use intersection observer
	noobserver?: boolean;
}

/**
 * Attributes as properties
 */
export interface IconifyIconAttributes
	extends Partial<
			Record<keyof Omit<IconifyIconProperties, 'icon' | 'mode'>, string>
		>,
		Partial<IconifyIconSVGAttributes> {
	// Icon to render: name or serialised object
	icon: string;

	// Render mode
	mode?: IconifyRenderMode;
}
