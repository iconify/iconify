import {
	getEmojiSequenceFromString,
	joinEmojiSequences,
	removeEmojiVariations,
	splitEmojiSequences,
} from './cleanup';
import { convertEmojiSequenceToUTF32 } from './convert';
import { keycapEmoji, vs16Emoji } from './data';
import { getEmojiSequenceString } from './format';

/**
 * Add optional variations to emojis
 *
 * Also converts list to UTF-32 as needed
 *
 * `testData`, returned by parseEmojiTestFile() is used to check which emojis have `FE0F` variations.
 * If missing or emoji is missing in test data, `FE0F` is added to every single code emoji.
 */
export function addOptionalVariations(
	sequences: number[][],
	testData?: number[][]
): number[][] {
	// Map test data
	const testDataMap = Object.create(null) as Record<string, string>;
	testData?.forEach((sequence) => {
		const convertedSequence = convertEmojiSequenceToUTF32(sequence);

		// Clean up sequence
		const key = getEmojiSequenceString(
			removeEmojiVariations(convertedSequence)
		);
		if (testDataMap[key]?.length > convertedSequence.length) {
			// Already got version with more variations
			return;
		}

		testDataMap[key] = getEmojiSequenceString(convertedSequence);
	});

	// Parse all sequences
	const set: Set<string> = new Set();

	sequences.forEach((sequence) => {
		const convertedSequence = convertEmojiSequenceToUTF32(sequence);
		const cleanSequence = removeEmojiVariations(convertedSequence);
		const mapKey = getEmojiSequenceString(cleanSequence);
		if (testDataMap[mapKey]) {
			// Got item from test data
			set.add(testDataMap[mapKey]);
			return;
		}

		// Emoji is missing in test data: add `FE0F` as needed
		const parts = splitEmojiSequences(convertedSequence).map((part) => {
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

		set.add(getEmojiSequenceString(joinEmojiSequences(parts)));
	});

	return Array.from(set).map(getEmojiSequenceFromString);
}
