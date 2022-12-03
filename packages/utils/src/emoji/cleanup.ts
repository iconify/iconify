import { getEmojiCodePoint } from './convert';
import { emojiTones, joinerEmoji, vs16Emoji } from './data';

/**
 * Get emoji sequence from string
 */
export function getEmojiSequenceFromString(value: string): number[] {
	return value.trim().split(/[\s-]/).map(getEmojiCodePoint);
}

/**
 * Split sequence by joiner
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
		for (let i = 0; i < emojiTones.length; i++) {
			const range = emojiTones[i];
			if (code >= range[0] && code < range[1]) {
				return false;
			}
		}
		return true;
	});
}

type MapCallback = (sequence: number[]) => number[];

/**
 * Run function on sequences
 *
 * Intended to be used with functions such as `removeEmojiVariations` or `removeEmojiTones`
 */
export function mapEmojiSequences(
	sequences: number[][],
	callback: MapCallback,
	removeEmpty = true
): number[][] {
	const results = sequences.map((sequence) => callback(sequence));
	return removeEmpty
		? results.filter((sequence) => sequence.length > 0)
		: results;
}
