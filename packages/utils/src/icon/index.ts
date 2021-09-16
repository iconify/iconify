import type {
	IconifyOptional,
	IconifyDimenisons,
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
 * Properties that can be minified
 *
 * Values of all these properties are awalys numbers
 */
export const minifyProps: (keyof IconifyDimenisons)[] = [
	// All IconifyDimenisons properties
	'width',
	'height',
	'top',
	'left',
];

/**
 * Default values for all optional IconifyIcon properties
 */
export const iconDefaults: Required<IconifyOptional> = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16,
	rotate: 0,
	vFlip: false,
	hFlip: false,
});

/**
 * Add optional properties to icon
 */
export function fullIcon(data: IconifyIcon): FullIconifyIcon {
	return { ...iconDefaults, ...data };
}
