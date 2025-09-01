import type { SVGProps, RefAttributes, ReactNode } from 'react';
import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconCustomisations as RawIconifyIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconify/utils/lib/customisations/defaults';

/**
 * Icon rendering mode
 *
 * Defines how the icon should be rendered in the DOM.
 *
 * - `'svg'` - Render as SVG element (recommended, best compatibility)
 * - `'style'` - Auto-detect between 'bg' or 'mask' based on icon content
 * - `'bg'` - Render as `<span>` with `background-image` CSS property
 * - `'mask'` - Render as `<span>` with `mask-image` CSS property
 *
 * @see https://iconify.design/docs/icon-components/react/render-modes.html
 */
export type IconifyRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Icon customisation properties
 *
 * Extends the base Iconify icon customisations with React-specific options.
 * These properties control the appearance and behavior of the icon.
 */
export type IconifyIconCustomisations = RawIconifyIconCustomisations & {
	/**
	 * Rotation angle for the icon
	 *
	 * Can be specified as:
	 * - String with units: "90deg", "0.5turn", "1.5708rad"
	 * - Number representing quarter-turns: 0=0°, 1=90°, 2=180°, 3=270°
	 *
	 * @example
	 * ```tsx
	 * <Icon icon="bi:check2-circle" /> // No rotation
	 * <Icon icon="bi:check2-circle" rotate="90deg" /> // 90° clockwise
	 * <Icon icon="bi:check2-circle" rotate={2} /> // 180° rotation
	 * <Icon icon="bi:check2-circle" rotate="0.5turn" /> // 180° rotation
	 * ```
	 *
	 * @see https://iconify.design/docs/icon-components/react/transform.html#rotation
	 */
	rotate?: string | number;

	/**
	 * Display mode for the icon
	 *
	 * When `true`, the icon is displayed as an inline element with baseline
	 * vertical alignment. When `false`, it's displayed as a block element
	 * with middle vertical alignment.
	 *
	 * @default false
	 *
	 * @example
	 * ```tsx
	 * <Icon icon="mdi:home" inline /> // Aligns with text baseline
	 * <Icon icon="mdi:home" /> // Centers vertically
	 * ```
	 *
	 * @see https://iconify.design/docs/icon-components/react/inline.html
	 */
	inline?: boolean;
};

export const defaultExtendedIconCustomisations = {
	...defaultIconCustomisations,
	inline: false,
};

/**
 * Callback function invoked when icon data has been loaded from the API
 *
 * @param name - The name of the icon that was loaded (e.g., "mdi:home")
 */
export type IconifyIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	/**
	 * The icon to render
	 *
	 * Can be either:
	 * - An icon object (IconifyIcon) containing SVG data
	 * - A string with icon name in format "prefix:name" (must be loaded first)
	 *
	 * @see https://iconify.design/docs/icon-components/react/#icon
	 */
	icon: IconifyIcon | string;

	/**
	 * Rendering mode for the icon
	 * @see {@link IconifyRenderMode}
	 */
	mode?: IconifyRenderMode;

	/**
	 * Icon color (for monotone icons only)
	 *
	 * Only affects monotone icons. Icons with hardcoded palettes (like emoji)
	 * cannot be recolored. Accepts any valid CSS color value.
	 *
	 * @see https://iconify.design/docs/icon-components/react/color.html
	 */
	color?: string;

	/**
	 * Flip transformation shorthand
	 *
	 * Convenient way to flip icons horizontally and/or vertically.
	 *
	 * @example
	 * flip="horizontal"
	 * flip="vertical"
	 * flip="horizontal,vertical"
	 *
	 * @see https://iconify.design/docs/icon-components/react/transform.html#flip
	 */
	flip?: string;

	/**
	 * Unique identifier for the icon
	 *
	 * Used as base for generating unique IDs for SVG elements and shapes.
	 * Ensures consistent IDs for server-side rendering and accessibility.
	 */
	id?: string;

	/**
	 * Server-side rendering mode
	 *
	 * When `true`, icon renders immediately without waiting for component
	 * to mount. Useful for server-side rendering to prevent hydration issues.
	 */
	ssr?: boolean;

	/**
	 * Fallback content while icon is loading or failed to load
	 *
	 * Displayed before the icon is loaded and rendered. If not provided,
	 * an empty span will be rendered as placeholder.
	 */
	fallback?: ReactNode;

	/**
	 * Callback fired when icon data is loaded
	 *
	 * Only triggered for icons loaded from the Iconify API. Not called
	 * for icons that are already available or provided as objects.
	 */
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
