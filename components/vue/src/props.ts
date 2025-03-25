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

	// Remove aria-hidden attribute
	ariaHidden?: boolean;
};

export const defaultExtendedIconCustomisations = {
	...defaultIconCustomisations,
	inline: false,
};

/**
 * Customise callback
 */
export type IconifyIconCustomiseCallback = (
	content: string,
	name: string,
	prefix: string,
	provider: string
) => string;

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	// Icon object
	icon: IconifyIcon | string;

	// Render mode
	mode?: IconifyRenderMode;

	// Style
	color?: string;

	// Shorthand flip
	flip?: string;

	// Vue specific flip properties because 'v-flip' is not a valid attribute in Vue
	horizontalFlip?: boolean;
	verticalFlip?: boolean;
}

/**
 * Properties for element that are mentioned in render.ts
 */
interface IconifyElementProps {
	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// Style
	style?: unknown;

	// Title will be integrated into SVG as <title> element
	title?: string;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export interface IconProps extends IconifyElementProps, IconifyIconProps {
	/**
	 * Try load icon on first render during SSR
	 *
	 * This is a low-level API for framework integrations, you don't usually need to use it directly.
	 * Note this might hydration mismatches if the icon data is not handled correctly, use with caution.
	 */
	ssr?: boolean;

	// Customise icon content (replace stroke-width, colors, etc...).
	// Called only for icons loaded from API
	customise?: IconifyIconCustomiseCallback;
}
