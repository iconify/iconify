import {
	getEmojiSequenceFromString,
	getUnqualifiedEmojiSequence,
} from '../cleanup';
import { getEmojiSequenceString } from '../format';

// Emoji types
type EmojiStatus =
	| 'component'
	| 'fully-qualified'
	| 'minimally-qualified'
	| 'unqualified';
export const componentStatus: EmojiStatus = 'component';

// Allowed status values, in order of conversion
const allowedStatus: Set<EmojiStatus> = new Set([
	componentStatus,
	'fully-qualified',
	'minimally-qualified',
	'unqualified',
]);

/**
 * Test data item
 */
export interface EmojiTestDataItem {
	// Group and subgroup
	group: string;
	subgroup: string;

	// Code points as string, lower case, dash separated
	code: string;

	// Code points as numbers, UTF-32
	sequence: number[];

	// Emoji string
	emoji: string;

	// Status
	status: EmojiStatus;

	// Version when emoji was added
	version: string;

	// Emoji name
	name: string;
}

/**
 * Get all emoji sequences from test file
 *
 * Returns all emojis as UTF-32 sequences
 */
export function parseEmojiTestFile(data: string): EmojiTestDataItem[] {
	const results: EmojiTestDataItem[] = [];
	let group: string | undefined;
	let subgroup: string | undefined;

	// Parse all lines
	data.split('\n').forEach((line) => {
		line = line.trim();
		const parts = line.split('#');
		if (parts.length < 2) {
			return;
		}

		// Get code and type from first chunk
		const firstChunk = (parts.shift() as string).trim();
		const secondChunk = parts.join('#').trim();
		if (!firstChunk) {
			// Empty first chunk: a comment
			const commentParts = secondChunk.split(':');
			if (commentParts.length === 2) {
				const key = commentParts[0].trim();
				const value = commentParts[1].trim();

				switch (key) {
					case 'group':
						group = value;
						subgroup = void 0;
						break;

					case 'subgroup':
						subgroup = value;
						break;
				}
			}

			return;
		}

		if (!group || !subgroup) {
			// Cannot parse emojis until group and subgroup are set
			return;
		}

		// Possible emoji line
		const firstChunkParts = firstChunk.split(';');
		if (firstChunkParts.length !== 2) {
			return;
		}

		const code = firstChunkParts[0]
			.trim()
			.replace(/\s+/g, '-')
			.toLowerCase();
		if (!code || !code.match(/^[a-f0-9]+[a-f0-9-]*[a-f0-9]+$/)) {
			return;
		}

		const status = firstChunkParts[1].trim() as EmojiStatus;
		if (!allowedStatus.has(status)) {
			throw new Error(`Bad emoji type: ${status}`);
		}

		// Parse second chunk
		const secondChunkParts = secondChunk.split(/\s+/);
		if (secondChunkParts.length < 3) {
			throw new Error(`Bad emoji comment for: ${code}`);
		}

		// Comment stuff
		const emoji = secondChunkParts.shift() as string;
		const version = secondChunkParts.shift() as string;
		if (version.slice(0, 1) !== 'E') {
			throw new Error(`Bad unicode version "${version}" for: ${code}`);
		}
		const name = secondChunkParts.join(' ');

		// Add item
		results.push({
			group,
			subgroup,
			code,
			sequence: getEmojiSequenceFromString(code),
			emoji,
			status,
			version,
			name,
		});
	});

	return results;
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
