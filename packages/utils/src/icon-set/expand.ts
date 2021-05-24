import type { IconifyJSON } from '@iconify/types';
import { minifyProps } from '../icon';

/**
 * Expand minified icon set
 *
 * Opposite of minifyIconSet() from ./minify.ts
 */
export function expandIconSet(data: IconifyJSON): void {
	const icons = Object.keys(data.icons);

	minifyProps.forEach((prop) => {
		if (typeof data[prop] !== 'number') {
			return;
		}
		const value = data[prop];

		icons.forEach((name) => {
			const item = data.icons[name];
			if (item[prop] === void 0) {
				item[prop] = value;
			}
		});

		delete data[prop];
	});
}
