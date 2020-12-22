/**
 * Regular expressions for calculating dimensions
 */
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

/**
 * Calculate second dimension when only 1 dimension is set
 *
 * @param {string|number} size One dimension (such as width)
 * @param {number} ratio Width/height ratio.
 *      If size is width, ratio = height/width
 *      If size is height, ratio = width/height
 * @param {number} [precision] Floating number precision in result to minimize output. Default = 2
 * @return {string|number} Another dimension
 */
export function calculateSize(
	size: string | number,
	ratio: number,
	precision?: number
): string | number {
	if (ratio === 1) {
		return size;
	}

	precision = precision === void 0 ? 100 : precision;
	if (typeof size === 'number') {
		return Math.ceil(size * ratio * precision) / precision;
	}

	if (typeof size !== 'string') {
		return size;
	}

	// Split code into sets of strings and numbers
	const oldParts = size.split(unitsSplit);
	if (oldParts === null || !oldParts.length) {
		return size;
	}

	const newParts = [];
	let code = oldParts.shift() as string;
	let isNumber = unitsTest.test(code as string);

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (isNumber) {
			const num = parseFloat(code);
			if (isNaN(num)) {
				newParts.push(code);
			} else {
				newParts.push(Math.ceil(num * ratio * precision) / precision);
			}
		} else {
			newParts.push(code);
		}

		// next
		code = oldParts.shift() as string;
		if (code === void 0) {
			return newParts.join('');
		}

		isNumber = !isNumber;
	}
}
