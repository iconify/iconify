import type {
	IconifyDimenisons,
	IconifyTransformations,
	IconifyOptional,
	IconifyIcon,
	ExtendedIconifyIcon,
} from '@iconify/types';

// Export icon and full icon types
export { IconifyIcon };

export type FullIconifyIcon = Required<IconifyIcon>;

// Partial and full extended icon
export type PartialExtendedIconifyIcon = Partial<ExtendedIconifyIcon>;

type IconifyIconExtraProps = Omit<ExtendedIconifyIcon, keyof IconifyIcon>;
export type FullExtendedIconifyIcon = FullIconifyIcon & IconifyIconExtraProps;

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
export const defaultIconProps: Required<IconifyOptional> = Object.freeze({
	...defaultIconDimensions,
	...defaultIconTransformations,
});

/**
 * Default values for all properties used in ExtendedIconifyIcon
 */
export const defaultExtendedIconProps: Required<FullExtendedIconifyIcon> =
	Object.freeze({
		...defaultIconProps,
		body: '',
		hidden: false,
	});
