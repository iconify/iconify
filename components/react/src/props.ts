import type { SVGProps, RefAttributes } from 'react';
import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconCustomisations as RawIconifyIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconify/utils/lib/customisations/defaults';

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = <span> with style using `background`
 * 'mask' = <span> with style using `mask`
 * 'svg' = <svg>
 */
export type IconifyRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Icon customisations
 */
export type IconifyIconCustomisations = RawIconifyIconCustomisations & {
	// Allow rotation to be string
	rotate?: string | number;

	// Inline mode
	inline?: boolean;
};

export const defaultExtendedIconCustomisations = {
	...defaultIconCustomisations,
	inline: false,
};

/**
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
export type IconifyIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	// Icon object or icon name (must be added to storage using addIcon for offline package)
	icon: IconifyIcon | string;

	// Render mode
	mode?: IconifyRenderMode;

	// Style
	color?: string;

	// Flip shorthand
	flip?: string;

	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// If true, icon will be rendered without waiting for component to mount, such as when rendering on server side
	ssr?: boolean;

	// Callback to call when icon data has been loaded. Used only for icons loaded from API
	onLoad?: IconifyIconOnLoad;
}

/**
 * React component properties: generic element for Icon component, SVG for generated component
 */
type IconifyElementProps = SVGProps<SVGSVGElement>;

/**
 * Reference for SVG element
 */
export type IconElement = SVGSVGElement | HTMLSpanElement;

/**
 * Mix of icon properties and SVGSVGElement properties
 */
export type IconProps = IconifyElementProps & IconifyIconProps;
