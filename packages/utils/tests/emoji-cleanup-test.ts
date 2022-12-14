import { convertEmojiSequenceToUTF32 } from '../lib/emoji/convert';
import {
	getEmojiSequenceFromString,
	joinEmojiSequences,
	mapEmojiSequences,
	removeEmojiTones,
	removeEmojiVariations,
	splitEmojiSequences,
} from '../lib/emoji/cleanup';

describe('Testing formatting emoji cleanup', () => {
	it('UTF-32 sequence', () => {
		// Convert from string
		const sequence = getEmojiSequenceFromString(
			'1F441 FE0F 200D 1F5E8 FE0F '
		);
		expect(sequence).toEqual([0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]);

		// Various representations of the same sequence
		expect(
			getEmojiSequenceFromString('1f441-fe0f-200d-1f5e8-fe0f')
		).toEqual(sequence);
		expect(
			convertEmojiSequenceToUTF32(
				getEmojiSequenceFromString(
					'\\uD83D\\uDC41\\uFE0F\\u200D\\uD83D\\uDDE8\\uFE0F'
				)
			)
		).toEqual(sequence);

		// Split
		const split = splitEmojiSequences(sequence);
		expect(split).toEqual([
			[0x1f441, 0xfe0f],
			[0x1f5e8, 0xfe0f],
		]);

		// Join again
		expect(joinEmojiSequences(split)).toEqual(sequence);

		// Remove variations
		expect(removeEmojiVariations(sequence)).toEqual([
			0x1f441, 0x200d, 0x1f5e8,
		]);
		expect(mapEmojiSequences(split, removeEmojiVariations)).toEqual([
			[0x1f441],
			[0x1f5e8],
		]);

		// Remove tones (does nothing for this sequence)
		expect(removeEmojiTones(sequence)).toEqual(sequence);
		expect(mapEmojiSequences(split, removeEmojiTones)).toEqual(split);
	});

	it('UTF-32 sequence with tones', () => {
		// Convert from string
		const sequence = getEmojiSequenceFromString(
			'1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff'
		);
		expect(sequence).toEqual([
			0x1f9d1, 0x1f3ff, 0x200d, 0x1f91d, 0x200d, 0x1f9d1, 0x1f3ff,
		]);

		// Split
		const split = splitEmojiSequences(sequence);
		expect(split).toEqual([
			[0x1f9d1, 0x1f3ff],
			[0x1f91d],
			[0x1f9d1, 0x1f3ff],
		]);

		// Join again
		expect(joinEmojiSequences(split)).toEqual(sequence);

		// Remove variations (does nothing for this sequence)
		expect(removeEmojiVariations(sequence)).toEqual(sequence);
		expect(mapEmojiSequences(split, removeEmojiVariations)).toEqual(split);

		// Remove tones
		expect(removeEmojiTones(sequence)).toEqual([
			0x1f9d1, 0x200d, 0x1f91d, 0x200d, 0x1f9d1,
		]);
		expect(mapEmojiSequences(split, removeEmojiTones)).toEqual([
			[0x1f9d1],
			[0x1f91d],
			[0x1f9d1],
		]);

		// Hair tones (bad emoji, second chunk only has tone without emoji)
		const sequence2 = getEmojiSequenceFromString('1F471 1F3FC-200D 1F3FF');
		expect(sequence2).toEqual([0x1f471, 0x1f3fc, 0x200d, 0x1f3ff]);
		const split2 = splitEmojiSequences(sequence2);

		expect(removeEmojiTones(sequence2)).toEqual([0x1f471, 0x200d]);
		expect(mapEmojiSequences(split2, removeEmojiTones)).toEqual([
			[0x1f471],
		]);
	});
});
