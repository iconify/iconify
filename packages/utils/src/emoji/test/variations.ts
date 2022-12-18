import {
	getEmojiSequenceFromString,
	joinEmojiSequences,
	removeEmojiVariations,
	splitEmojiSequences,
} from '../cleanup';
import { convertEmojiSequenceToUTF32 } from '../convert';
import { keycapEmoji, vs16Emoji } from '../data';
import { getEmojiSequenceKeyword } from '../format';
import { EmojiTestDataItem, getQualifiedEmojiSequencesMap } from './parse';

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
 * Get qualified variations for emojis
 *
 * Also converts list to UTF-32 as needed and removes duplicate items
 *
 * `testData`, returned by parseEmojiTestFile() is used to check which emojis have `FE0F` variations.
 * If missing or emoji is missing in test data, `FE0F` is added to every single code emoji.
 * It can also be an array of sequences.
 */
export function getQualifiedEmojiVariations(
	sequences: number[][],
	testData?: (number[] | EmojiTestDataItem)[]
): number[][];
export function getQualifiedEmojiVariations(
	sequences: number[][],
	testData: (number[] | EmojiTestDataItem)[],
	toString: (value: number[]) => string
): string[];
export function getQualifiedEmojiVariations(
	sequences: number[][],
	testData: (number[] | EmojiTestDataItem)[] = [],
	toString?: (value: number[]) => string
): number[][] | string[] {
	const convert = toString || getEmojiSequenceKeyword;
	const testSequences = testData.map((item) =>
		item instanceof Array ? item : item.sequence
	);

	// Map test data
	const testDataMap = getQualifiedEmojiSequencesMap(testSequences, convert);

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
