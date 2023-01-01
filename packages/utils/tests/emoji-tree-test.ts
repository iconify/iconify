/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getEmojiSequenceFromString } from '../lib/emoji/cleanup';
import { createRegexForNumbersSequence } from '../lib/emoji/regex/numbers';
import { createEmojisTree, parseEmojiTree } from '../lib/emoji/regex/tree';

describe('Emoji regex tree', () => {
	it('Creating simple tree', () => {
		const numbers = [
			getEmojiSequenceFromString('1F3C1'),
			getEmojiSequenceFromString('1F3F3'),
			getEmojiSequenceFromString('1F3F3 FE0F'),
			getEmojiSequenceFromString('1F3F4 200D 2620 FE0F'),
			getEmojiSequenceFromString('1F3F4 200D 2620'),
		];
		const tree = createEmojisTree(numbers);
		expect(tree).toEqual([
			{
				regex: createRegexForNumbersSequence([0x1f3c1]),
				end: true,
			},
			{
				regex: createRegexForNumbersSequence([0x1f3f3]),
				end: true,
			},
			{
				regex: createRegexForNumbersSequence([0x1f3f3, 0xfe0f]),
				end: true,
			},
			{
				regex: createRegexForNumbersSequence([0x1f3f4]),
				children: [
					{
						regex: createRegexForNumbersSequence([0x2620, 0xfe0f]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([0x2620]),
						end: true,
					},
				],
			},
		]);

		expect(parseEmojiTree(tree).regex).toEqual(
			'\\uD83C(?:(?:\\uDFF4\\u200D\\u2620|\\uDFF3)\\uFE0F?|[\\uDFC1\\uDFF3])'
		);
	});

	it('Creating complex tree', () => {
		const numbers = [
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FC'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FD'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FE'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FF'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FB'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FD'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FE'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FF'),
			getEmojiSequenceFromString('1FAF1 1F3FB'),
		];
		const tree = createEmojisTree(numbers);
		expect(tree).toEqual([
			{
				regex: createRegexForNumbersSequence([0x1faf1, 0x1f3fb]),
				end: true,
				children: [
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fc,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fd,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fe,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3ff,
						]),
						end: true,
					},
				],
			},
			{
				regex: createRegexForNumbersSequence([0x1faf1, 0x1f3fc]),
				children: [
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fb,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fd,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fe,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3ff,
						]),
						end: true,
					},
				],
			},
		]);

		expect(parseEmojiTree(tree).regex).toEqual(
			'\\uD83E\\uDEF1\\uD83C' +
				// depth: 1
				'(?:\\uDFFB' +
				// depth: 2
				'(?:\\u200D\\uD83E\\uDEF2\\uD83C' +
				// depth: 3
				'[\\uDFFC-\\uDFFF]' +
				// depth: 2
				')?' +
				// depth: 1
				'|\\uDFFC\\u200D\\uD83E\\uDEF2\\uD83C' +
				// depth: 2
				'[\\uDFFB\\uDFFD-\\uDFFF]' +
				// depth: 1
				')'
		);
	});

	it('Creating complex optimisable tree', () => {
		const numbers = [
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FC'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FD'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FE'),
			getEmojiSequenceFromString('1FAF1 1F3FB 200D 1FAF2 1F3FF'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FC'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FD'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FE'),
			getEmojiSequenceFromString('1FAF1 1F3FC 200D 1FAF2 1F3FF'),
			getEmojiSequenceFromString('1FAF1 1F3FB'),
			getEmojiSequenceFromString('1FAF1 1F3FC'),
		];
		const tree = createEmojisTree(numbers);
		expect(tree).toEqual([
			{
				regex: createRegexForNumbersSequence([0x1faf1, 0x1f3fb]),
				end: true,
				children: [
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fc,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fd,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fe,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3ff,
						]),
						end: true,
					},
				],
			},
			{
				regex: createRegexForNumbersSequence([0x1faf1, 0x1f3fc]),
				end: true,
				children: [
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fc,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fd,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3fe,
						]),
						end: true,
					},
					{
						regex: createRegexForNumbersSequence([
							0x1faf2, 0x1f3ff,
						]),
						end: true,
					},
				],
			},
		]);

		// expect(parseEmojiTree(tree).regex).toEqual(
		// 	'\\uD83E\\uDEF1\\uD83C(?:\\uDFFB|\\uDFFC)(?:\\u200D\\uD83E\\uDEF2\\uD83C[\\uDFFC-\\uDFFF])?'
		// );
	});

	it('Multiple children with same last child', () => {
		const numbers = [
			getEmojiSequenceFromString(
				'1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc'
			),
			getEmojiSequenceFromString(
				'1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fc'
			),
		];
		const tree = createEmojisTree(numbers);
		expect(tree).toEqual([
			{
				regex: createRegexForNumbersSequence([0x1f9d1, 0x1f3fb]),
				children: [
					{
						regex: createRegexForNumbersSequence([0x2764, 0xfe0f]),
						children: [
							{
								regex: createRegexForNumbersSequence([0x1f48b]),
								children: [
									{
										regex: createRegexForNumbersSequence([
											0x1f9d1, 0x1f3fc,
										]),
										end: true,
									},
								],
							},
							{
								regex: createRegexForNumbersSequence([
									0x1f9d1, 0x1f3fc,
								]),
								end: true,
							},
						],
					},
				],
			},
		]);

		// 'D83E-DDD1-D83C-DFFB-200D-2764-FE0F-200D-D83D-DC8B-200D-D83E-DDD1-D83C-DFFC' +
		// 'D83E-DDD1-D83C-DFFB-200D-2764-FE0F-200D-D83E-DDD1-D83C-DFFC' =
		// 'D83E-DDD1-D83C-DFFB-200D-2764-FE0F-200D' + 'D83D-DC8B-200D'? + 'D83E-DDD1-D83C-DFFC' +
		expect(parseEmojiTree(tree).regex).toEqual(
			// First common chunk
			'\\uD83E\\uDDD1\\uD83C\\uDFFB\\u200D\\u2764\\uFE0F?\\u200D' +
				// Optional chunk
				'(?:\\uD83D\\uDC8B\\u200D)?' +
				// Last common chunk
				'\\uD83E\\uDDD1\\uD83C\\uDFFC'
		);
	});
});
