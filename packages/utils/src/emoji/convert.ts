import {
	endUTF32Pair,
	minUTF32,
	startUTF32Pair1,
	startUTF32Pair2,
} from './data';

/**
 * Convert string to number
 */
export function getEmojiCodePoint(code: string): number {
	return parseInt(code, 16);
}

/**
 * First part of UTF-32 to UTF-16
 */
function utf32FirstNum(code: number): number {
	return (((code - minUTF32) >> 0x0a) | 0x0) + startUTF32Pair1;
}

/**
 * First part of UTF-32 to UTF-16
 */
function utf32SecondNum(code: number): number {
	return ((code - minUTF32) & 0x3ff) + startUTF32Pair2;
}

/**
 * Get UTF-32 as UTF-16 sequence
 */
export function splitUTF32Number(code: number): [number, number] | undefined {
	if (code >= minUTF32) {
		return [utf32FirstNum(code), utf32SecondNum(code)];
	}
}

/**
 * Check if number is UTF-32 split as UTF-16
 *
 * Returns:
 * - 1 if number fits first number in sequence
 * - 2 if number fits second number in sequence
 * - false on failure
 */
export function isUTF32SplitNumber(value: number): 1 | 2 | false {
	if (value >= startUTF32Pair1) {
		if (value < startUTF32Pair2) {
			return 1;
		}
		if (value < endUTF32Pair) {
			return 2;
		}
	}
	return false;
}

/**
 * Get UTF-16 sequence as UTF-32
 */
export function mergeUTF32Numbers(
	part1: number,
	part2: number
): number | undefined {
	// Check ranges
	if (
		part1 < startUTF32Pair1 ||
		part1 >= startUTF32Pair2 ||
		part2 < startUTF32Pair2 ||
		part2 >= endUTF32Pair
	) {
		return;
	}

	// Merge values
	return (
		((part1 - startUTF32Pair1) << 0x0a) +
		(part2 - startUTF32Pair2) +
		minUTF32
	);
}

/**
 * Convert hexadecimal string or number to unicode
 */
export function getEmojiUnicode(code: number | string): string {
	return String.fromCodePoint(
		typeof code === 'number' ? code : getEmojiCodePoint(code)
	);
}

/**
 * Convert sequence to UTF-16
 */
export function convertEmojiSequenceToUTF16(numbers: number[]): number[] {
	const results: number[] = [];
	for (let i = 0; i < numbers.length; i++) {
		const code = numbers[i];
		if (code >= minUTF32) {
			results.push(utf32FirstNum(code));
			results.push(utf32SecondNum(code));
		} else {
			results.push(code);
		}
	}
	return results;
}

/**
 * Convert sequence to UTF-32
 */
export function convertEmojiSequenceToUTF32(
	numbers: number[],
	throwOnError = true
): number[] {
	const results: number[] = [];
	for (let i = 0; i < numbers.length; i++) {
		const code = numbers[i];
		if (code >= minUTF32) {
			// Already UTF-32
			results.push(code);
			continue;
		}

		const part = isUTF32SplitNumber(code);
		if (!part) {
			// Nothing to convert
			results.push(code);
			continue;
		}

		// UTF-32 code as 2 part sequence
		if (part === 1 && numbers.length > i + 1) {
			const merged = mergeUTF32Numbers(code, numbers[i + 1]);
			if (merged) {
				// Success
				i++;
				results.push(merged);
				continue;
			}
		}

		// Failed to merge UTF-32 sequence
		if (throwOnError) {
			const nextCode = numbers[i + 1];
			throw new Error(
				`Invalid UTF-16 sequence: ${code.toString(16)}-${
					nextCode ? nextCode.toString(16) : 'undefined'
				}`
			);
		}
		results.push(code);
	}
	return results;
}
