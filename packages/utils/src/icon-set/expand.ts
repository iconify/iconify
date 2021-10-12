import type { IconifyJSON } from '@iconify/types';
import { iconDefaults } from '../icon';

/**
 * Expand minified icon set
 *
 * Opposite of minifyIconSet() from ./minify.ts
 */
export function expandIconSet(data: IconifyJSON): void {
	const icons = Object.keys(data.icons);

	(Object.keys(iconDefaults) as (keyof typeof iconDefaults)[]).forEach(
		(prop) => {
			if (typeof data[prop] !== typeof iconDefaults[prop]) {
				return;
			}
			const value = data[prop];

			icons.forEach((name) => {
				const item = data.icons[name];
				if (item[prop] === void 0) {
					item[prop as 'height'] = value as number;
				}
			});

			delete data[prop];
		}
	);
}
