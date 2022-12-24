import {
	getEmojiSequenceFromString,
	getUnqualifiedEmojiSequence,
} from '../cleanup';
import { getEmojiSequenceKeyword } from '../format';

// Emoji types
export type EmojiStatus =
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
 * Base item
 */
export interface BaseEmojiTestDataItem {
	// Group and subgroup
	group: string;
	subgroup: string;

	// Version when emoji was added
	version: string;
}

/**
 * Test data item
 */
export interface EmojiTestDataItem extends BaseEmojiTestDataItem {
	// Code points as numbers, UTF-32
	sequence: number[];

	// Emoji string
	emoji: string;

	// Status
	status: EmojiStatus;

	// Emoji name
	name: string;
}

export type EmojiTestData = Record<string, EmojiTestDataItem>;

/**
 * Get qualified variations from parsed test file
 *
 * Key is unqualified emoji, value is longest fully qualified emoji
 */
function getQualifiedTestData(data: EmojiTestData): EmojiTestData {
	const results = Object.create(null) as EmojiTestData;

	for (const key in data) {
		const item = data[key];
		const sequence = getUnqualifiedEmojiSequence(item.sequence);
		const shortKey = getEmojiSequenceKeyword(sequence);

		// Check if values mismatch, set results to longest value
		if (
			!results[shortKey] ||
			results[shortKey].sequence.length < sequence.length
		) {
			results[shortKey] = item;
		}
	}

	return results;
}

/**
 * Get all emoji sequences from test file
 *
 * Returns all emojis as UTF-32 sequences, where:
 * 	key = unqualified sequence (without \uFE0F)
 * 	value = qualified sequence (with \uFE0F)
 *
 * Duplicate items that have different versions with and without \uFE0F are
 * listed only once, with unqualified sequence as key and longest possible
 * qualified sequence as value
 *
 * Example of 3 identical entries:
 *  '1F441 FE0F 200D 1F5E8 FE0F'
 *  '1F441 200D 1F5E8 FE0F'
 *  '1F441 FE0F 200D 1F5E8'
 * 	'1F441 200D 1F5E8'
 *
 * Out of these entries, only one item will be returned with:
 * 	key = '1f441-200d-1f5e8' (converted to lower case, separated with dash)
 * 	value.sequence = [0x1F441, 0xFE0F, 0x200D, 0x1F5E8, 0xFE0F]
 * 	value.status = 'fully-qualified'
 * 	other properties in value are identical for all versions
 */
export function parseEmojiTestFile(data: string): EmojiTestData {
	const results = Object.create(null) as EmojiTestData;
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

		const code = firstChunkParts[0].trim();
		if (!code || !code.match(/^[A-F0-9]+[A-F0-9\s]*[A-F0-9]+$/)) {
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

		// Get sequence and convert it to cleaned up string
		const sequence = getEmojiSequenceFromString(code);
		const key = getEmojiSequenceKeyword(sequence);

		// Add item
		if (results[key]) {
			throw new Error(`Duplicate entry for "${code}"`);
		}
		results[key] = {
			group,
			subgroup,
			sequence,
			emoji,
			status,
			version,
			name,
		};
	});

	return getQualifiedTestData(results);
}
