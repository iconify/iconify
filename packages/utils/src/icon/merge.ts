import type { IconifyOptional } from '@iconify/types';
import type { FullIconifyIcon, IconifyIcon } from '.';
import { iconDefaults } from '.';

/**
 * Merge icon and alias
 */
export function mergeIconData<T extends IconifyIcon | FullIconifyIcon>(
	icon: T,
	alias: IconifyOptional
): T {
	const result = { ...icon };
	for (const key in iconDefaults) {
		const prop = key as keyof IconifyOptional;
		if (alias[prop] !== void 0) {
			const value = alias[prop];

			if (result[prop] === void 0) {
				// Missing value
				(result as unknown as Record<string, unknown>)[prop] = value;
				continue;
			}

			switch (prop) {
				case 'rotate':
					(result[prop] as number) =
						((result[prop] as number) + (value as number)) % 4;
					break;

				case 'hFlip':
				case 'vFlip':
					result[prop] = value !== result[prop];
					break;

				default:
					// Overwrite value
					(result as unknown as Record<string, unknown>)[prop] =
						value;
			}
		}
	}
	return result;
}
