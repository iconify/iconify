import { IconifyIcon } from '@iconify/types';
import { merge } from '../misc/merge';

export { IconifyIcon };
export type FullIconifyIcon = Omit<Required<IconifyIcon>, 'hidden'>;

/**
 * Default values for IconifyIcon properties
 */
export const iconDefaults: FullIconifyIcon = Object.freeze({
	body: '',
	left: 0,
	top: 0,
	width: 16,
	height: 16,
	rotate: 0,
	vFlip: false,
	hFlip: false,
});

/**
 * Create new icon with all properties
 */
export function fullIcon(icon: IconifyIcon): FullIconifyIcon {
	return merge(iconDefaults, icon as FullIconifyIcon) as FullIconifyIcon;
}
