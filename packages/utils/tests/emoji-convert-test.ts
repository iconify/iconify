/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	getEmojiCodePoint,
	getEmojiUnicode,
	splitUTF32Number,
	isUTF32SplitNumber,
	mergeUTF32Numbers,
	convertEmojiSequenceToUTF16,
	convertEmojiSequenceToUTF32,
} from '../lib/emoji/convert';

describe('Testing emoji code points', () => {
	it('UTF-16', () => {
		// Convert to number
		const codePoint = getEmojiCodePoint('2764');
		expect(codePoint).toBe(parseInt('2764', 16));

		// Check for UTF-32
		expect(splitUTF32Number(codePoint)).toBeUndefined();
		expect(isUTF32SplitNumber(codePoint)).toBe(false);

		// Convert to character
		expect(getEmojiUnicode(codePoint)).toBe('\u2764');
	});

	it('UTF-32', () => {
		// Convert to number
		const codePoint = getEmojiCodePoint('1F49A');
		expect(codePoint).toBe(parseInt('1F49A', 16));
		expect(isUTF32SplitNumber(codePoint)).toBe(false);

		// Convert to UTF-16 sequence
		const sequence = splitUTF32Number(codePoint);
		expect(sequence).toEqual([55357, 56474]);
		expect(isUTF32SplitNumber(sequence![0])).toBe(1);
		expect(isUTF32SplitNumber(sequence![1])).toBe(2);

		// Convert back to UTF-32
		expect(mergeUTF32Numbers(...sequence!)).toBe(codePoint);

		// Convert to string
		expect(getEmojiUnicode(codePoint)).toBe('\uD83D\uDC9A');
	});

	it('Sequences to UTF-16', () => {
		// Nothing to convert
		expect(convertEmojiSequenceToUTF16([])).toEqual([]);
		expect(convertEmojiSequenceToUTF16([0x263a, 0xfe0f])).toEqual([
			0x263a, 0xfe0f,
		]);

		// UTF-32
		expect(
			convertEmojiSequenceToUTF16([
				0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f,
			])
		).toEqual([0xd83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f]);
	});

	it('Sequences to UTF-32', () => {
		let thrown: boolean;

		// Nothing to convert
		expect(convertEmojiSequenceToUTF32([])).toEqual([]);
		expect(
			convertEmojiSequenceToUTF32([
				0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f,
			])
		).toEqual([0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]);

		// UTF-16
		expect(
			convertEmojiSequenceToUTF32([
				0xd83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f,
			])
		).toEqual([0x1f441, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]);

		// Bad UTF-16: first character is wrong
		expect(
			convertEmojiSequenceToUTF32(
				[0xa83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f],
				false
			)
		).toEqual([0xa83d, 0xdc41, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]);
		thrown = false;
		try {
			expect(
				convertEmojiSequenceToUTF32([
					0xa83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f,
				])
			);
		} catch {
			thrown = true;
		}
		expect(thrown).toBe(true);

		// Bad UTF-16: second character is wrong
		expect(
			convertEmojiSequenceToUTF32(
				[0xd83d, 0xec41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f],
				false
			)
		).toEqual([0xd83d, 0xec41, 0xfe0f, 0x200d, 0x1f5e8, 0xfe0f]);
		thrown = false;
		try {
			expect(
				convertEmojiSequenceToUTF32([
					0xd83d, 0xec41, 0xfe0f, 0x200d, 0xd83d, 0xdde8, 0xfe0f,
				])
			);
		} catch {
			thrown = true;
		}
		expect(thrown).toBe(true);

		// Bad UTF-16: unexpected end
		expect(
			convertEmojiSequenceToUTF32(
				[0xd83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d],
				false
			)
		).toEqual([0x1f441, 0xfe0f, 0x200d, 0xd83d]);
		thrown = false;
		try {
			expect(
				convertEmojiSequenceToUTF32([
					0xd83d, 0xdc41, 0xfe0f, 0x200d, 0xd83d,
				])
			);
		} catch {
			thrown = true;
		}
		expect(thrown).toBe(true);
	});
});
