import { IconifyIcon, iconDefaults } from './';

/**
 * Icon keys
 */
const iconKeys = Object.keys(iconDefaults) as (keyof IconifyIcon)[];

/**
 * Merge two icons
 *
 * icon2 overrides icon1
 */
export function mergeIcons(
	icon1: IconifyIcon,
	icon2: IconifyIcon
): IconifyIcon {
	const icon = Object.create(null);
	iconKeys.forEach(key => {
		if (icon1[key] === void 0) {
			if (icon2[key] !== void 0) {
				icon[key] = icon2[key];
			}
			return;
		}
		if (icon2[key] === void 0) {
			icon[key] = icon1[key];
			return;
		}

		switch (key) {
			case 'rotate':
				icon[key] =
					((icon1[key] as number) + (icon2[key] as number)) % 4;
				return;

			case 'hFlip':
			case 'vFlip':
				icon[key] = icon1[key] !== icon2[key];
				return;

			default:
				icon[key] = icon2[key];
		}
	});

	return icon;
}
