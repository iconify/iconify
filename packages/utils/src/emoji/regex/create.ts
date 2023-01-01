import { getSequenceFromEmojiStringOrKeyword } from '../cleanup';
import { convertEmojiSequenceToUTF32 } from '../convert';
import { getQualifiedEmojiVariations } from '../test/variations';
import { createEmojisTree, parseEmojiTree } from './tree';

/**
 * Create optimised regex
 */
export function createOptimisedRegexForEmojiSequences(
	sequences: number[][]
): string {
	// Convert to UTF-32
	sequences = sequences.map((item) => convertEmojiSequenceToUTF32(item));

	// Create tree
	const tree = createEmojisTree(sequences);

	// Optimise
	const regex = parseEmojiTree(tree);

	// Return regex
	return regex.regex;
}

/**
 * Create optimised regex for emojis
 *
 * First parameter is array of emojis, entry can be either list of
 * code points or emoji sequence as a string
 *
 * Examples of acceptable strings (case insensitive):
 * 	'1F636 200D 1F32B FE0F' - space separated UTF32 sequence
 * 	'1f636-200d-1f32b-fe0f' - dash separated UTF32 sequence
 *  'd83d-de36-200d-d83c-df2b-fe0f' - dash separated UTF16 sequence
 *  '\\uD83D\\uDE36\\u200D\\uD83C\\uDF2B\\uFE0F' - UTF16 sequence escaped with '\\u'
 *
 * All examples above refer to the same emoji and will generate the same regex result
 */
export function createOptimisedRegex(emojis: (string | number[])[]): string {
	// Convert to numbers
	let sequences = emojis.map((item) =>
		typeof item === 'string'
			? getSequenceFromEmojiStringOrKeyword(item)
			: item
	);

	// Add variations
	// Temporary convert to object with 'sequence' property
	sequences = getQualifiedEmojiVariations(
		sequences.map((sequence) => {
			return {
				sequence,
			};
		})
	).map((item) => item.sequence);

	// Parse
	return createOptimisedRegexForEmojiSequences(sequences);
}
