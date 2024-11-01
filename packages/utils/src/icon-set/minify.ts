import type { IconifyJSON } from '@iconify/types';
import { defaultIconDimensions } from '../icon/defaults';

/**
 * Minify icon set
 *
 * Function finds common values for few numeric properties, such as 'width' and 'height' (see defaultIconDimensions keys for list of properties),
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

	(
		Object.keys(
			defaultIconDimensions
		) as (keyof typeof defaultIconDimensions)[]
	).forEach((prop) => {
		// Check for default value for property
		if (data[prop] === defaultIconDimensions[prop]) {
			delete data[prop];
		}
		const defaultValue = defaultIconDimensions[prop];
		const propType = typeof defaultValue;

		// Check for previously minified value
		const hasMinifiedDefault =
			typeof data[prop] === propType && data[prop] !== defaultValue;

		// Find value that is used by most icons
		let maxCount = 0;
		let maxValue: typeof defaultValue | null = null;
		const counters: Map<typeof defaultValue, number> = new Map();

		for (let i = 0; i < icons.length; i++) {
			const item = data.icons[icons[i]];

			let value: typeof defaultValue;
			if (typeof item[prop] === propType) {
				value = item[prop]!;
			} else if (hasMinifiedDefault) {
				value = data[prop]!;
			} else {
				value = defaultIconDimensions[prop];
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

		const canMinify = maxValue !== null && maxCount > 1;

		// Get default value
		const oldDefault = hasMinifiedDefault ? data[prop] : null;
		const newDefault = canMinify ? maxValue : oldDefault;
		// console.log(
		// 	`Prop: ${prop}, oldDefault: ${oldDefault}, canMinify: ${canMinify}, maxValue: ${maxValue}`
		// );

		// Change global value
		if (newDefault === defaultValue) {
			delete data[prop];
		} else if (canMinify) {
			data[prop as 'height'] = newDefault as number;
		}

		// Update all icons
		icons.forEach((key) => {
			const item = data.icons[key];
			const value =
				prop in item
					? item[prop]
					: hasMinifiedDefault
					? oldDefault
					: defaultValue;
			if (
				value === newDefault ||
				(newDefault === null && value === defaultValue)
			) {
				// Property matches minified value
				// Property matches default value and there is no minified value
				delete item[prop];
				return;
			}

			if (canMinify && !(prop in item)) {
				// Value matches old minified value
				item[prop as 'height'] = value as number;
			}
		});
	});
}
