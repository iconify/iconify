import { convertEmojiSequenceToUTF32 } from '../lib/emoji/convert';
import {
	getEmojiSequenceFromString,
	joinEmojiSequences,
	getUnqualifiedEmojiSequence,
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
		expect(getUnqualifiedEmojiSequence(sequence)).toEqual([
			0x1f441, 0x200d, 0x1f5e8,
		]);
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
		expect(getUnqualifiedEmojiSequence(sequence)).toEqual(sequence);
	});
});
