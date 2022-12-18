import { getEmojiCodePoint } from './convert';
import { emojiComponents, joinerEmoji, vs16Emoji } from './data';
import { getEmojiSequenceKeyword } from './format';

/**
 * Get emoji sequence from string
 *
 * Examples (shows same emoji sequence formatted differently):
 *  '1F441 FE0F 200D 1F5E8 FE0F' => [0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]
 *  '1f441-fe0f-200d-1f5e8-fe0f' => [0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]
 *  '\\uD83D\\uDC41\\uFE0F\\u200D\\uD83D\\uDDE8\\uFE0F' => [0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]
 */
export function getEmojiSequenceFromString(value: string): number[] {
	return value
		.trim()
		.split(/[^0-9A-F]+/i)
		.filter((item) => item.length > 0)
		.map(getEmojiCodePoint);
}

/**
 * Split emoji sequence by joiner
 *
 * Result represents one emoji, split in smaller sequences separated by 0x200D
 *
 * Example:
 * 	[0x1FAF1, 0x1F3FB, 0x200D, 0x1FAF2, 0x1F3FC] => [[0x1FAF1, 0x1F3FB], [0x1FAF2, 0x1F3FC]]
 */
export function splitEmojiSequences(sequence: number[]): number[][] {
	const results: number[][] = [];
	let queue: number[] = [];
	for (let i = 0; i < sequence.length; i++) {
		const code = sequence[i];
		if (code === joinerEmoji) {
			results.push(queue);
			queue = [];
		} else {
			queue.push(code);
		}
	}
	results.push(queue);
	return results;
}

/**
 * Join emoji sequences
 *
 * Parameter represents one emoji, split in smaller sequences
 *
 * Example:
 * 	[[0x1FAF1, 0x1F3FB], [0x1FAF2, 0x1F3FC]] => [0x1FAF1, 0x1F3FB, 0x200D, 0x1FAF2, 0x1F3FC]
 */
export function joinEmojiSequences(sequences: number[][]): number[] {
	let results: number[] = [];
	for (let i = 0; i < sequences.length; i++) {
		if (i > 0) {
			results.push(joinerEmoji);
		}
		results = results.concat(sequences[i]);
	}
	return results;
}

/**
 * Remove variations
 */
export function removeEmojiVariations(sequence: number[]): number[] {
	return sequence.filter((code) => code !== vs16Emoji);
}

/**
 * Remove variations
 *
 * This function should be used with UTF-32 sequence, not UTF-16
 */
export function removeEmojiTones(sequence: number[]): number[] {
	return sequence.filter((code) => {
		for (const key in emojiComponents) {
			const range = emojiComponents[key as keyof typeof emojiComponents];
			if (code >= range[0] && code < range[1]) {
				return false;
			}
		}
		return true;
	});
}

/**
 * Get unqualified sequence
 */
export function getUnqualifiedEmojiSequence(sequence: number[]): number[] {
	return sequence.filter((num) => num !== vs16Emoji);
}

/**
 * Types for mapEmojiSequence()
 */
type MapCallback = (sequence: number[]) => number[];
interface MapOptions {
	removeEmpty?: boolean;
	removeDuplicates?: boolean;
}

const mapOptions: Required<MapOptions> = {
	removeEmpty: true,
	removeDuplicates: false,
};

/**
 * Run function on sequences
 *
 * Intended to be used with functions such as `removeEmojiVariations` or `removeEmojiTones`
 */
export function mapEmojiSequences(
	sequences: number[][],
	callback: MapCallback,
	options: MapOptions = {}
): number[][] {
	const fullOptions = {
		...mapOptions,
		...options,
	};
	const values: Set<string> = new Set();
	const results: number[][] = [];

	sequences.forEach((sequence) => {
		const result = callback(sequence);

		// Check for empty sequences
		if (fullOptions.removeEmpty && !result.length) {
			return;
		}

		// Check for duplicate
		if (fullOptions.removeDuplicates) {
			const value = getEmojiSequenceKeyword(result);
			if (values.has(value)) {
				// duplicate
				return;
			}
			values.add(value);
		}

		results.push(result);
	});

	return results;
}
