import {
	getEmojiSequenceFromString,
	joinEmojiSequences,
	removeEmojiVariations,
	splitEmojiSequences,
} from './cleanup';
import { convertEmojiSequenceToUTF32 } from './convert';
import { keycapEmoji, vs16Emoji } from './data';
import { getEmojiSequenceString } from './format';
import { getQualifiedEmojiSequencesMap } from './parse-test';

/**
 * Get unqualified sequence
 */
export function getUnqualifiedEmojiSequence(sequence: number[]): number[] {
	return sequence.filter((num) => num !== vs16Emoji);
}

/**
 * Get qualified sequence, adding optional `FE0F` wherever it might exist
 *
 * This might result in sequence that is not actually valid, but considering
 * that `FE0F` is always treated as optional, full sequence used in regex will
 * catch both qualified and unqualified emojis, so proper sequence will get
 * caught anyway. This function just makes sure that in case if sequence does
 * have `FE0F`, it will be caught by regex too.
 */
export function guessQualifiedEmojiSequence(sequence: number[]): number[] {
	const split = splitEmojiSequences(sequence).map((part) => {
		// Check for `FE0F`
		if (part.indexOf(vs16Emoji) !== -1) {
			return part;
		}

		// Check for keycap
		if (part.length === 2 && part[1] === keycapEmoji) {
			return [part[0], vs16Emoji, part[1]];
		}

		// Add `FE0F` to 1 character emojis
		return part.length === 1 ? [part[0], vs16Emoji] : part;
	});
	return joinEmojiSequences(split);
}

/**
 * Add optional variations to emojis
 *
 * Also converts list to UTF-32 as needed
 *
 * `testData`, returned by parseEmojiTestFile() is used to check which emojis have `FE0F` variations.
 * If missing or emoji is missing in test data, `FE0F` is added to every single code emoji.
 */
export function addOptionalEmojiVariations(
	sequences: number[][],
	testData?: number[][]
): number[][];
export function addOptionalEmojiVariations(
	sequences: number[][],
	testData: number[][],
	toString: (value: number[]) => string
): string[];
export function addOptionalEmojiVariations(
	sequences: number[][],
	testData: number[][] = [],
	toString?: (value: number[]) => string
): number[][] | string[] {
	const convert = toString || getEmojiSequenceString;

	// Map test data
	const testDataMap = getQualifiedEmojiSequencesMap(testData, convert);

	// Parse all sequences
	const set: Set<string> = new Set();

	sequences.forEach((sequence) => {
		// Convert to UTF-32, remove variations
		const convertedSequence = convertEmojiSequenceToUTF32(sequence);
		const cleanSequence = removeEmojiVariations(convertedSequence);

		// Check test data
		const mapKey = convert(cleanSequence);
		if (testDataMap[mapKey]) {
			// Got item from test data
			set.add(testDataMap[mapKey]);
			return;
		}

		// Not in test data: guess variations
		set.add(convert(guessQualifiedEmojiSequence(cleanSequence)));
	});

	const results = Array.from(set);
	return toString ? results : results.map(getEmojiSequenceFromString);
}
