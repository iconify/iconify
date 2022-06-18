import type {
	IconifyDimenisons,
	IconifyTransformations,
	IconifyOptional,
	IconifyIcon,
} from '@iconify/types';

// Export icon and full icon types
export { IconifyIcon };
export type FullIconifyIcon = Required<IconifyIcon>;

/**
 * Expression to test part of icon name.
 */
export const matchName = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Default values for dimensions
 */
export const defaultIconDimensions: Required<IconifyDimenisons> = Object.freeze(
	{
		left: 0,
		top: 0,
		width: 16,
		height: 16,
	}
);

/**
 * Default values for transformations
 */
export const defaultIconTransformations: Required<IconifyTransformations> =
	Object.freeze({
		rotate: 0,
		vFlip: false,
		hFlip: false,
	});

/**
 * Default values for all optional IconifyIcon properties
 */
export const iconDefaults: Required<IconifyOptional> = Object.freeze({
	...defaultIconDimensions,
	...defaultIconTransformations,
});

/**
 * Add optional properties to icon
 */
export function fullIcon(data: IconifyIcon): FullIconifyIcon {
	return { ...iconDefaults, ...data };
}
