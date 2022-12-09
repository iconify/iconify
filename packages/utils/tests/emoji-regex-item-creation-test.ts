import {
	createOptionalEmojiRegexItem,
	createSequenceEmojiRegexItem,
	createSetEmojiRegexItem,
	createUTF16EmojiRegexItem,
} from '../lib/emoji/regex/base';

describe('Creating chunks of regex', () => {
	it('UTF-16 numbers', () => {
		// Number
		expect(createUTF16EmojiRegexItem([0x2763])).toEqual({
			type: 'utf16',
			regex: '\\u2763',
			numbers: [0x2763],
			length: 1,
			group: true,
		});

		// Range
		expect(createUTF16EmojiRegexItem([0x2762, 0x2764, 0x2763])).toEqual({
			type: 'utf16',
			regex: '[\\u2762-\\u2764]',
			numbers: [0x2762, 0x2763, 0x2764],
			length: 1,
			group: true,
		});

		// Separate numbers
		expect(createUTF16EmojiRegexItem([0x2760, 0x2764, 0xfe0f])).toEqual({
			type: 'utf16',
			regex: '[\\u2760\\u2764\\uFE0F]',
			numbers: [0x2760, 0x2764, 0xfe0f],
			length: 1,
			group: true,
		});

		// Ranges + numbers, duplicate item
		expect(
			createUTF16EmojiRegexItem([
				0x2760, 0x2762, 0x2761, 0x2765, 0x2763, 0xfe0f, 0xfe0f, 0xfe0e,
				0x2000, 0x2001, 0x2100, 0x2102, 0x2101,
			])
		).toEqual({
			type: 'utf16',
			regex: '[\\u2000\\u2001\\u2100-\\u2102\\u2760-\\u2763\\u2765\\uFE0E\\uFE0F]',
			numbers: [
				0x2000, 0x2001, 0x2100, 0x2101, 0x2102, 0x2760, 0x2761, 0x2762,
				0x2763, 0x2765, 0xfe0e, 0xfe0f, 0xfe0f,
			],
			length: 1,
			group: true,
		});
	});

	it('Sequence from numbers', () => {
		const num1 = createUTF16EmojiRegexItem([0x2000, 0x2001]);
		const num2 = createUTF16EmojiRegexItem([0x2000, 0x2100]);

		// 1 item
		expect(createSequenceEmojiRegexItem([num1])).toEqual({
			type: 'sequence',
			regex: '[\\u2000\\u2001]',
			numbers: [0x2000, 0x2001],
			items: [num1],
			length: 1,
			group: true,
		});

		// 2 numbers
		expect(createSequenceEmojiRegexItem([num1, num2])).toEqual({
			type: 'sequence',
			regex: '[\\u2000\\u2001][\\u2000\\u2100]',
			items: [num1, num2],
			length: 2,
			group: false,
		});
	});

	it('Sets from numbers', () => {
		const num1 = createUTF16EmojiRegexItem([0x2000, 0x2001]);
		const num2 = createUTF16EmojiRegexItem([0x2000, 0x2100]);

		// 1 item
		expect(createSetEmojiRegexItem([num1])).toEqual({
			type: 'set',
			regex: '[\\u2000\\u2001]',
			numbers: [0x2000, 0x2001],
			sets: [num1],
			length: 1,
			group: true,
		});

		// 2 numbers
		expect(createSetEmojiRegexItem([num1, num2])).toEqual({
			type: 'set',
			regex: '[\\u2000\\u2001]|[\\u2000\\u2100]',
			numbers: [0x2000, 0x2001, 0x2000, 0x2100],
			sets: [num1, num2],
			length: 1,
			group: false,
		});
	});

	it('Optional numbers', () => {
		const num1 = createUTF16EmojiRegexItem([0xfe0f]);
		const num2 = createUTF16EmojiRegexItem([0xfe0e, 0xfe0f]);

		// simple item
		expect(createOptionalEmojiRegexItem(num1)).toEqual({
			type: 'optional',
			regex: '\\uFE0F?',
			item: num1,
			length: 1,
			group: true,
		});

		// 2 numbers
		expect(createOptionalEmojiRegexItem(num2)).toEqual({
			type: 'optional',
			regex: '[\\uFE0E\\uFE0F]?',
			item: num2,
			length: 1,
			group: true,
		});
	});

	it('Sequence', () => {
		const num1 = createUTF16EmojiRegexItem([0x2000, 0x2001]);
		const num2 = createUTF16EmojiRegexItem([0x2000, 0x2100]);
		const fe0f = createOptionalEmojiRegexItem(
			createUTF16EmojiRegexItem([0xfe0f])
		);

		// optional item
		expect(createSequenceEmojiRegexItem([fe0f])).toEqual({
			type: 'sequence',
			regex: '\\uFE0F?',
			items: [fe0f],
			length: 1,
			group: true,
		});

		const seq1 = createSequenceEmojiRegexItem([num1, fe0f]);
		expect(seq1).toEqual({
			type: 'sequence',
			regex: '[\\u2000\\u2001]\\uFE0F?',
			items: [num1, fe0f],
			length: 2,
			group: false,
		});

		// number + optional item + number
		expect(createSequenceEmojiRegexItem([num1, fe0f, num2])).toEqual({
			type: 'sequence',
			regex: '[\\u2000\\u2001]\\uFE0F?[\\u2000\\u2100]',
			items: [num1, fe0f, num2],
			length: 3,
			group: false,
		});

		// number + nested sequence
		expect(createSequenceEmojiRegexItem([num2, seq1])).toEqual({
			type: 'sequence',
			regex: '[\\u2000\\u2100][\\u2000\\u2001]\\uFE0F?',
			items: [num2, num1, fe0f],
			length: 3,
			group: false,
		});
	});

	it('Mix', () => {
		const num1 = createUTF16EmojiRegexItem([
			0x1234, 0x1235, 0x1236, 0x1237,
		]);

		// UTF-32
		const utf32a1 = createUTF16EmojiRegexItem([0xd83d]);
		const utf32a2 = createUTF16EmojiRegexItem([0xdc9a]);
		const utf32a = createSequenceEmojiRegexItem([utf32a1, utf32a2]);
		expect(utf32a).toEqual({
			type: 'sequence',
			regex: '\\uD83D\\uDC9A',
			items: [utf32a1, utf32a2],
			length: 2,
			group: false,
		});
		utf32a.numbers = [0x1f49a];

		// Make it optional
		expect(createOptionalEmojiRegexItem(utf32a)).toEqual({
			type: 'optional',
			regex: '(?:\\uD83D\\uDC9A)?',
			item: utf32a,
			length: 2,
			group: true,
		});

		// Set of numbers
		const set = createSetEmojiRegexItem([num1, utf32a]);
		expect(set).toEqual({
			type: 'set',
			regex: '\\uD83D\\uDC9A|[\\u1234-\\u1237]',
			sets: [utf32a, num1],
			numbers: [0x1234, 0x1235, 0x1236, 0x1237, 0x1f49a],
			length: 1,
			group: false,
		});

		// Make it optional
		expect(createOptionalEmojiRegexItem(set)).toEqual({
			type: 'optional',
			regex: '(?:\\uD83D\\uDC9A|[\\u1234-\\u1237])?',
			item: set,
			length: 1,
			group: true,
		});

		// Sequence with set
		const utf16a = createUTF16EmojiRegexItem([0x2000]);
		const utf16b = createUTF16EmojiRegexItem([0x2100]);
		const utf16c = createUTF16EmojiRegexItem([0x2101]);
		const set1 = createSetEmojiRegexItem([utf16b, utf16c]);
		expect(createSequenceEmojiRegexItem([utf16a, set1])).toEqual({
			type: 'sequence',
			regex: '\\u2000(?:\\u2100|\\u2101)',
			items: [utf16a, set1],
			length: 2,
			group: false,
		});
	});
});
