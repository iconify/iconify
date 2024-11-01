/**
 * Regular expressions for calculating dimensions
 */
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

/**
 * Calculate second dimension when only 1 dimension is set
 */
export function calculateSize(
	size: string,
	ratio: number,
	precision?: number
): string;
export function calculateSize(
	size: number,
	ratio: number,
	precision?: number
): number;
export function calculateSize(
	size: string | number,
	ratio: number,
	precision?: number
): string | number;
export function calculateSize(
	size: string | number,
	ratio: number,
	precision?: number
): string | number {
	if (ratio === 1) {
		return size;
	}

	precision = precision || 100;
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
	let isNumber = unitsTest.test(code);

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
