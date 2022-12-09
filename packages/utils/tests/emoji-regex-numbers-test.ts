import {
	createOptionalEmojiRegexItem,
	createSetEmojiRegexItem,
	createUTF16EmojiRegexItem,
} from '../lib/emoji/regex/base';
import {
	createEmojiRegexItemForNumbers,
	createRegexForNumbersSequence,
	optimiseNumbersSet,
} from '../lib/emoji/regex/numbers';

describe('Creating chunks of regex for numbers', () => {
	it('Numbers', () => {
		// UTF-16
		expect(createEmojiRegexItemForNumbers([0x2763])).toEqual({
			type: 'utf16',
			regex: '\\u2763',
			numbers: [0x2763],
			length: 1,
			group: true,
		});

		expect(
			createEmojiRegexItemForNumbers([0x2761, 0x2765, 0x2764, 0x2763])
		).toEqual({
			type: 'utf16',
			regex: '[\\u2761\\u2763-\\u2765]',
			numbers: [0x2761, 0x2763, 0x2764, 0x2765],
			length: 1,
			group: true,
		});

		// UTF-32
		expect(createEmojiRegexItemForNumbers([0x1f49a])).toEqual({
			type: 'sequence',
			regex: '\\uD83D\\uDC9A',
			items: [
				{
					type: 'utf16',
					regex: '\\uD83D',
					numbers: [0xd83d],
					length: 1,
					group: true,
				},
				{
					type: 'utf16',
					regex: '\\uDC9A',
					numbers: [0xdc9a],
					length: 1,
					group: true,
				},
			],
			numbers: [0x1f49a],
			length: 2,
			group: false,
		});

		// Similar ranges
		const items1 = createEmojiRegexItemForNumbers([
			0x1f49a, 0x1f49c, 0x1f49b, 0x1f89a, 0x1f89b, 0x1f89c,
		]);
		delete (items1 as unknown as Record<string, unknown>).items;
		expect(items1).toEqual({
			type: 'sequence',
			regex: '[\\uD83D\\uD83E][\\uDC9A-\\uDC9C]',
			numbers: [0x1f49a, 0x1f49b, 0x1f49c, 0x1f89a, 0x1f89b, 0x1f89c],
			length: 2,
			group: false,
		});

		// Mismatched ranges
		const items2 = createEmojiRegexItemForNumbers([
			0x1f49a, 0x1f49c, 0x1f49b, 0x1f89a, 0x1f89b, 0x1f89e,
		]);
		delete (items2 as unknown as Record<string, unknown>).sets;
		expect(items2).toEqual({
			type: 'set',
			regex: '\\uD83D[\\uDC9A-\\uDC9C]|\\uD83E[\\uDC9A\\uDC9B\\uDC9E]',
			numbers: [0x1f49a, 0x1f49b, 0x1f49c, 0x1f89a, 0x1f89b, 0x1f89e],
			length: 2,
			group: false,
		});

		// Mix
		const items3 = createEmojiRegexItemForNumbers([
			0x2763, 0x2765, 0x1f49a, 0x1f49c, 0x1f49b, 0x1f89a, 0x1f89b,
			0x1f89e, 0x2764,
		]);
		delete (items3 as unknown as Record<string, unknown>).sets;
		expect(items3).toEqual({
			type: 'set',
			regex: '\\uD83D[\\uDC9A-\\uDC9C]|\\uD83E[\\uDC9A\\uDC9B\\uDC9E]|[\\u2763-\\u2765]',
			numbers: [
				0x2763, 0x2764, 0x2765, 0x1f49a, 0x1f49b, 0x1f49c, 0x1f89a,
				0x1f89b, 0x1f89e,
			],
			length: 1,
			group: false,
		});
	});

	it('Numbers sequence', () => {
		// UTF-16: cannot be sequence
		expect(createRegexForNumbersSequence([0x2763])).toEqual(
			createUTF16EmojiRegexItem([0x2763])
		);

		// UTF-32
		expect(createRegexForNumbersSequence([0x1f49a])).toEqual({
			type: 'sequence',
			regex: '\\uD83D\\uDC9A',
			numbers: [0x1f49a],
			items: [
				createUTF16EmojiRegexItem([0xd83d]),
				createUTF16EmojiRegexItem([0xdc9a]),
			],
			length: 2,
			group: false,
		});

		// Variation
		expect(createRegexForNumbersSequence([0x1f49a, 0xfe0f])).toEqual({
			type: 'sequence',
			regex: '\\uD83D\\uDC9A\\uFE0F?',
			items: [
				createUTF16EmojiRegexItem([0xd83d]),
				createUTF16EmojiRegexItem([0xdc9a]),
				createOptionalEmojiRegexItem(
					createUTF16EmojiRegexItem([0xfe0f])
				),
			],
			length: 3,
			group: false,
		});

		expect(createRegexForNumbersSequence([0x1f49a, 0xfe0f], false)).toEqual(
			{
				type: 'sequence',
				regex: '\\uD83D\\uDC9A\\uFE0F',
				items: [
					createUTF16EmojiRegexItem([0xd83d]),
					createUTF16EmojiRegexItem([0xdc9a]),
					createUTF16EmojiRegexItem([0xfe0f]),
				],
				length: 3,
				group: false,
			}
		);

		// Variation only
		expect(createRegexForNumbersSequence([0xfe0f])).toEqual(
			createOptionalEmojiRegexItem(createUTF16EmojiRegexItem([0xfe0f]))
		);
	});

	it('Optimising set', () => {
		// Mix of numbers
		expect(
			optimiseNumbersSet(
				createSetEmojiRegexItem([
					// Mandatory
					createUTF16EmojiRegexItem([0x2000]),
					createUTF16EmojiRegexItem([0x2001]),
					createEmojiRegexItemForNumbers([0x1f932]),
					// Optional
					createOptionalEmojiRegexItem(
						createUTF16EmojiRegexItem([0x2100])
					),
					createOptionalEmojiRegexItem(
						createEmojiRegexItemForNumbers([0x1f91d])
					),
				])
			)
		).toEqual(
			createSetEmojiRegexItem([
				createOptionalEmojiRegexItem(
					createEmojiRegexItemForNumbers([0x1f91d, 0x2100])
				),
				createEmojiRegexItemForNumbers([0x2000, 0x2001, 0x1f932]),
			])
		);

		// Duplicate optional and mandatory numbers
		expect(
			optimiseNumbersSet(
				createSetEmojiRegexItem([
					// Mandatory
					createUTF16EmojiRegexItem([0x2000]),
					createUTF16EmojiRegexItem([0x2001]),
					createEmojiRegexItemForNumbers([0x1f932]),
					// Optional
					createOptionalEmojiRegexItem(
						createUTF16EmojiRegexItem([0x2001, 0x2002])
					),
					createOptionalEmojiRegexItem(
						createEmojiRegexItemForNumbers([0x1f91d])
					),
				])
			)
		).toEqual(
			createSetEmojiRegexItem([
				createOptionalEmojiRegexItem(
					createEmojiRegexItemForNumbers([0x1f91d, 0x2001, 0x2002])
				),
				createEmojiRegexItemForNumbers([0x2000, 0x1f932]),
			])
		);
	});
});
