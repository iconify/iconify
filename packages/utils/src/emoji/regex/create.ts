import { getEmojiSequenceFromString } from '../cleanup';
import { convertEmojiSequenceToUTF32 } from '../convert';
import { addOptionalEmojiVariations } from '../variations';
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
 */
export function createOptimisedRegex(
	emojis: (string | number[])[],
	testData?: number[][]
): string {
	// Convert to numbers
	let sequences = emojis.map((item) =>
		typeof item === 'string' ? getEmojiSequenceFromString(item) : item
	);

	// Add variations
	sequences = addOptionalEmojiVariations(sequences, testData);

	// Parse
	return createOptimisedRegexForEmojiSequences(sequences);
}
