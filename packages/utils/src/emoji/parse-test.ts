import { getEmojiSequenceFromString } from './cleanup';

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
 * Returns dash-separated hexadecimal codes
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

	// Return all emojis as sequences
	return Array.from(emojis).map(getEmojiSequenceFromString);
}
