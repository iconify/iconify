import { getEmojiSequenceFromString } from './cleanup';
import { convertEmojiSequenceToUTF32 } from './convert';
import { getEmojiSequenceString } from './format';
import { getUnqualifiedEmojiSequence } from './variations';

// Emoji types
type EmojiType =
	| 'component'
	| 'fully-qualified'
	| 'minimally-qualified'
	| 'unqualified';
const componentType: EmojiType = 'component';

// Allowed types, in order of conversion
const allowedTypes: Set<EmojiType> = new Set([
	componentType,
	'fully-qualified',
	'minimally-qualified',
	'unqualified',
]);

/**
 * Get all emoji sequences from test file
 *
 * Returns all emojis as UTF-32 sequences
 */
export function parseEmojiTestFile(data: string): number[][] {
	const emojis: Set<string> = new Set();

	// Parse all lines
	data.split('\n').forEach((line) => {
		line = line.trim();
		const parts = line.split('#');
		if (parts.length < 2) {
			return;
		}

		// Get code and type from first chunk
		const firstChunk = (parts.shift() as string).trim();
		if (!firstChunk) {
			// Empty first chunk: a comment
			return;
		}
		const firstChunkParts = firstChunk.split(';');
		if (firstChunkParts.length !== 2) {
			return;
		}
		const text = firstChunkParts[0].trim();
		const code = text.toLowerCase().replace(/\s+/g, '-');
		if (!code || !code.match(/^[a-f0-9]+[a-f0-9-]*[a-f0-9]+$/)) {
			return;
		}
		const type = firstChunkParts[1].trim() as EmojiType;
		if (!allowedTypes.has(type)) {
			throw new Error(`Bad emoji type: ${type}`);
		}

		// Add code
		emojis.add(code);
	});

	// Return all emojis as sequences, converted to UTF-32
	return Array.from(emojis).map((item) =>
		convertEmojiSequenceToUTF32(getEmojiSequenceFromString(item))
	);
}

/**
 * Get qualified variations from parsed test file
 *
 * Key is unqualified emoji, value is longest fully qualified emoji
 */
export function getQualifiedEmojiSequencesMap(
	sequences: number[][]
): Map<number[], number[]>;
export function getQualifiedEmojiSequencesMap(
	sequences: number[][],
	toString: (value: number[]) => string
): Record<string, string>;
export function getQualifiedEmojiSequencesMap(
	sequences: number[][],
	toString?: (value: number[]) => string
): Map<number[], number[]> | Record<string, string> {
	const convert = toString || getEmojiSequenceString;
	const results = Object.create(null) as Record<string, string>;

	for (let i = 0; i < sequences.length; i++) {
		const value = convert(sequences[i]);
		const unqualified = convert(getUnqualifiedEmojiSequence(sequences[i]));
		// Check if values mismatch, set results to longest value
		if (
			!results[unqualified] ||
			results[unqualified].length < value.length
		) {
			results[unqualified] = value;
		}
	}

	// Return
	if (toString) {
		return results;
	}

	const map: Map<number[], number[]> = new Map();
	for (const key in results) {
		const value = results[key];
		map.set(
			getEmojiSequenceFromString(key),
			getEmojiSequenceFromString(value)
		);
	}
	return map;
}
