import type { IconifyJSON } from '@iconify/types';
import { minifyProps, iconDefaults } from '../icon';

/**
 * Minify icon set
 *
 * Function finds common values for few numeric properties, such as 'width' and 'height' (see minifyProps for list of properties),
 * removes entries from icons and sets default entry in root of icon set object.
 *
 * For example, this:
 * {
 *  icons: {
 *      foo: {
 *          body: '<g />',
 *          width: 24
 *      },
 *      bar: {
 *          body: '<g />',
 *          width: 24
 *      },
 *      baz: {
 *          body: '<g />',
 *          width: 16
 *      }
 *  }
 * }
 * is changed to this:
 * {
 *  icons: {
 *      foo: {
 *          body: '<g />'
 *      },
 *      bar: {
 *          body: '<g />'
 *      },
 *      baz: {
 *          body: '<g />',
 *          width: 16
 *      }
 *  },
 *  width: 24
 * }
 */
export function minifyIconSet(data: IconifyJSON): void {
	const icons = Object.keys(data.icons);

	minifyProps.forEach((prop) => {
		// Check for default value for property
		const hasIconDefault = typeof iconDefaults[prop] === 'number';
		if (hasIconDefault && data[prop] === iconDefaults[prop]) {
			delete data[prop];
		}

		// Check for previously minified value
		const hasMinifiedDefault = typeof data[prop] === 'number';

		// Find value that is used by most icons
		let maxCount = 0,
			maxValue: number | null = null,
			counters: Map<number, number> = new Map();

		for (let i = 0; i < icons.length; i++) {
			let item = data.icons[icons[i]];

			let value: number;
			if (typeof item[prop] === 'number') {
				value = item[prop]!;
			} else if (hasMinifiedDefault) {
				value = data[prop]!;
			} else if (hasIconDefault) {
				value = iconDefaults[prop];
			} else {
				// Cannot minify property
				maxValue = null;
				break;
			}

			if (i === 0) {
				// First item
				maxCount = 1;
				maxValue = value;
				counters.set(value, 1);
				continue;
			}

			if (!counters.has(value)) {
				// First entry for new value
				counters.set(value, 1);
				continue;
			}

			const count = counters.get(value)! + 1;
			counters.set(value, count);
			if (count > maxCount) {
				maxCount = count;
				maxValue = value;
			}
		}

		// Found value to minify
		const canMinify = maxValue !== null && maxCount > 1;
		const oldDefault = hasMinifiedDefault ? data[prop] : null;

		// Change global value
		if (!canMinify) {
			delete data[prop];
		} else {
			data[prop] = maxValue!;
		}

		// Check if new minified value matches default value
		if (hasIconDefault && data[prop] === iconDefaults[prop]) {
			delete data[prop];
		}

		// Minify stuff
		icons.forEach((key) => {
			const item = data.icons[key];
			if (canMinify && item[prop] === maxValue) {
				// New value matches minified value
				delete item[prop];
				return;
			}

			if (hasMinifiedDefault && item[prop] === void 0) {
				// Old value matches old minified value
				item[prop] = oldDefault!;
			}

			if (!canMinify && item[prop] === iconDefaults[prop]) {
				// Current value (after changes above) matches default and there is no minified value
				delete item[prop];
			}
		});
	});
}
