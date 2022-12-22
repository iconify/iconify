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
export function splitEmojiSequences(
	sequence: number[],
	separator = joinerEmoji
): number[][] {
	const results: number[][] = [];
	let queue: number[] = [];
	for (let i = 0; i < sequence.length; i++) {
		const code = sequence[i];
		if (code === separator) {
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
export function joinEmojiSequences(
	sequences: number[][],
	separator = joinerEmoji
): number[] {
	let results: number[] = [];
	for (let i = 0; i < sequences.length; i++) {
		if (i > 0) {
			results.push(separator);
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
 * Get unqualified sequence
 */
export function getUnqualifiedEmojiSequence(sequence: number[]): number[] {
	return sequence.filter((num) => num !== vs16Emoji);
}
