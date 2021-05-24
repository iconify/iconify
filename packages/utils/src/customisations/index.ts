/**
 * Icon alignment
 */
export type IconifyHorizontalIconAlignment = 'left' | 'center' | 'right';
export type IconifyVerticalIconAlignment = 'top' | 'middle' | 'bottom';

/**
 * Icon size
 */
export type IconifyIconSize = null | string | number;

/**
 * Icon customisations
 */
export interface IconifyIconCustomisations {
	// Display mode
	inline?: boolean;

	// Dimensions
	width?: IconifyIconSize;
	height?: IconifyIconSize;

	// Alignment
	hAlign?: IconifyHorizontalIconAlignment;
	vAlign?: IconifyVerticalIconAlignment;
	slice?: boolean;

	// Transformations
	hFlip?: boolean;
	vFlip?: boolean;
	rotate?: number;
}

export type FullIconCustomisations = Required<IconifyIconCustomisations>;

/**
 * Default icon customisations values
 */
export const defaults: FullIconCustomisations = Object.freeze({
	// Display mode
	inline: false,

	// Dimensions
	width: null,
	height: null,

	// Alignment
	hAlign: 'center',
	vAlign: 'middle',
	slice: false,

	// Transformations
	hFlip: false,
	vFlip: false,
	rotate: 0,
});

/**
 * TypeScript
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental, @typescript-eslint/no-unused-vars
function assertNever(v: never) {
	//
}

/**
 * Convert IconifyIconCustomisations to FullIconCustomisations
 */
export function mergeCustomisations(
	defaults: FullIconCustomisations,
	item: IconifyIconCustomisations
): FullIconCustomisations {
	const result: FullIconCustomisations = {} as FullIconCustomisations;
	for (const key in defaults) {
		const attr = key as keyof FullIconCustomisations;

		// Copy old value
		(result as Record<string, unknown>)[attr] = defaults[attr];

		if (item[attr] === void 0) {
			continue;
		}

		// Validate new value
		const value = item[attr];
		switch (attr) {
			// Boolean attributes that override old value
			case 'inline':
			case 'slice':
				if (typeof value === 'boolean') {
					result[attr] = value;
				}
				break;

			// Boolean attributes that are merged
			case 'hFlip':
			case 'vFlip':
				if (value === true) {
					result[attr] = !result[attr];
				}
				break;

			// Non-empty string
			case 'hAlign':
			case 'vAlign':
				if (typeof value === 'string' && value !== '') {
					(result as Record<string, unknown>)[attr] = value;
				}
				break;

			// Non-empty string / non-zero number / null
			case 'width':
			case 'height':
				if (
					(typeof value === 'string' && value !== '') ||
					(typeof value === 'number' && value) ||
					value === null
				) {
					result[attr] = value;
				}
				break;

			// Rotation
			case 'rotate':
				if (typeof value === 'number') {
					result[attr] += value;
				}
				break;

			default:
				assertNever(attr);
		}
	}
	return result;
}
