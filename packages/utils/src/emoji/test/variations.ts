import {
	getUnqualifiedEmojiSequence,
	joinEmojiSequences,
	splitEmojiSequences,
} from '../cleanup';
import { convertEmojiSequenceToUTF32 } from '../convert';
import { emojiComponents, keycapEmoji, vs16Emoji } from '../data';
import { getEmojiSequenceKeyword } from '../format';

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

		// Check for keycap and components
		if (part.length === 2) {
			const lastNum = part[1];
			if (lastNum === keycapEmoji) {
				// emoji + keycap
				return [part[0], vs16Emoji, lastNum];
			}
			for (const key in emojiComponents) {
				const range =
					emojiComponents[key as keyof typeof emojiComponents];
				if (lastNum >= range[0] && lastNum < range[1]) {
					// emoji + component
					return [part[0], vs16Emoji, lastNum];
				}
			}
		}

		// Add `FE0F` to 1 character emojis
		return part.length === 1 ? [part[0], vs16Emoji] : part;
	});
	return joinEmojiSequences(split);
}

/**
 * Base type to extend
 */
interface BaseSequenceItem {
	sequence: number[];

	// If present, will be set in value too
	// String version of sequence without variation unicode
	sequenceKey?: string;
}

/**
 * Get qualified variations for emojis
 *
 * Also converts list to UTF-32 as needed and removes duplicate items
 */
export function getQualifiedEmojiVariation<T extends BaseSequenceItem>(
	item: T
): T {
	// Convert to UTF-32, get unqualified sequence
	const unqualifiedSequence = getUnqualifiedEmojiSequence(
		convertEmojiSequenceToUTF32(item.sequence)
	);

	const result: T = {
		...item,
		sequence: guessQualifiedEmojiSequence(unqualifiedSequence),
	};
	if (result.sequenceKey) {
		result.sequenceKey = getEmojiSequenceKeyword(unqualifiedSequence);
	}
	return result;
}

/**
 * Get qualified emoji variations for set of emojis, ignoring duplicate entries
 */
export function getQualifiedEmojiVariations<T extends BaseSequenceItem>(
	items: T[]
): T[] {
	// Parse all sequences
	const results = Object.create(null) as Record<string, T>;

	for (let i = 0; i < items.length; i++) {
		const result = getQualifiedEmojiVariation(items[i]);
		const key = getEmojiSequenceKeyword(
			getUnqualifiedEmojiSequence(result.sequence)
		);
		if (
			!results[key] ||
			results[key].sequence.length < result.sequence.length
		) {
			results[key] = result;
		}
	}

	return Object.values(results);
}
