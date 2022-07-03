import type { IconifyJSON } from '@iconify/types';
import { defaultIconDimensions } from '../icon/defaults';

/**
 * Expand minified icon set
 *
 * Opposite of minifyIconSet() from ./minify.ts
 */
export function expandIconSet(data: IconifyJSON): void {
	const icons = Object.keys(data.icons);

	(
		Object.keys(
			defaultIconDimensions
		) as (keyof typeof defaultIconDimensions)[]
	).forEach((prop) => {
		if (typeof data[prop] !== typeof defaultIconDimensions[prop]) {
			return;
		}
		const value = data[prop];

		icons.forEach((name) => {
			const item = data.icons[name];
			if (!(prop in item)) {
				item[prop] = value;
			}
		});

		delete data[prop];
	});
}
