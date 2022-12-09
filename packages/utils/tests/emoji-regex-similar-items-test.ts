/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { splitUTF32Number } from '../lib/emoji/convert';
import {
	createOptionalEmojiRegexItem,
	createSequenceEmojiRegexItem,
	createSetEmojiRegexItem,
	createUTF16EmojiRegexItem,
	SequenceEmojiItemRegex,
} from '../lib/emoji/regex/base';
import {
	createEmojiRegexItemForNumbers,
	createRegexForNumbersSequence,
} from '../lib/emoji/regex/numbers';
import {
	findSimilarRegexItemSequences,
	mergeSimilarItemsInSet,
	mergeSimilarRegexItemSequences,
} from '../lib/emoji/regex/similar';

describe('Similar chunks of regex', () => {
	it('Nothing in common', () => {
		// Nothing in common
		expect(
			findSimilarRegexItemSequences([
				createRegexForNumbersSequence([0x1234, 0x2345]),
			])
		).toBeUndefined();

		expect(
			findSimilarRegexItemSequences([
				createEmojiRegexItemForNumbers([0x1234]),
				createOptionalEmojiRegexItem(
					createEmojiRegexItemForNumbers([0x1234])
				),
			])
		).toBeUndefined();

		expect(
			findSimilarRegexItemSequences([
				createEmojiRegexItemForNumbers([0x1234]),
				// Match is in middle of sequence
				createRegexForNumbersSequence([0x1230, 0x1234, 0x1235]),
			])
		).toBeUndefined();
	});

	it('Simple match', () => {
		const items = [
			createEmojiRegexItemForNumbers([0x1234]),
			createRegexForNumbersSequence([0x1234, 0x1235]),
			createRegexForNumbersSequence([0xfe0f]),
		];
		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 6,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 'full',
						},
						{
							index: 1,
							slice: 1,
						},
					],
				},
			],
		});
		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(items, sequence)
		);

		expect(set).toEqual({
			type: 'set',
			regex: '\\u1234\\u1235?|\\uFE0F?',
			sets: [
				createSequenceEmojiRegexItem([
					items[0],
					createOptionalEmojiRegexItem(
						createUTF16EmojiRegexItem([0x1235])
					),
				]),
				items[2],
			],
			group: false,
		});
	});

	it('Range of numbers', () => {
		const items = [
			createRegexForNumbersSequence([0x1f91d, 0x1f3fb]),
			createRegexForNumbersSequence([0x1f91d, 0x1f3fc]),
			createRegexForNumbersSequence([0x1f91d, 0x1f3fd]),
			createRegexForNumbersSequence([0x1f91d, 0x1f3fe]),
			createRegexForNumbersSequence([0x1f91d, 0x1f3ff]),
		];
		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 72,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 3,
						},
						{
							index: 1,
							slice: 3,
						},
						{
							index: 2,
							slice: 3,
						},
						{
							index: 3,
							slice: 3,
						},
						{
							index: 4,
							slice: 3,
						},
					],
				},
			],
		});
		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(
				items,
				sequence,
				mergeSimilarItemsInSet
			)
		);

		const commonChunk = (items[0] as SequenceEmojiItemRegex).items.slice(
			0,
			3
		);
		expect(set).toEqual({
			type: 'set',
			regex: '\\uD83E\\uDD1D\\uD83C[\\uDFFB-\\uDFFF]',
			sets: [
				createSequenceEmojiRegexItem([
					...commonChunk,
					createUTF16EmojiRegexItem([
						0xdffb, 0xdffc, 0xdffd, 0xdffe, 0xdfff,
					]),
				]),
			],
			group: false,
		});
	});

	it('Multiple matches', () => {
		const items = [
			createEmojiRegexItemForNumbers([0x1234]),
			createRegexForNumbersSequence([0x1234, 0x1235]),
			createEmojiRegexItemForNumbers([0x1235]),
		];
		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 6,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 'full',
						},
						{
							index: 1,
							slice: 1,
						},
					],
				},
				{
					type: 'end',
					slices: [
						{
							index: 1,
							slice: 1,
						},
						{
							index: 2,
							slice: 'full',
						},
					],
				},
			],
		});

		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply first merge only
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(items, sequence)
		);

		expect(set).toEqual({
			type: 'set',
			regex: '\\u1234\\u1235?|\\u1235',
			sets: [
				createSequenceEmojiRegexItem([
					items[0],
					createOptionalEmojiRegexItem(items[2]),
				]),
				items[2],
			],
			group: false,
		});
	});

	it('Extra number', () => {
		const items = [
			createRegexForNumbersSequence([0x1f64f]),
			createRegexForNumbersSequence([0x1f64f, 0x1f3fb]),
		];
		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 12,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 'full',
						},
						{
							index: 1,
							slice: 2,
						},
					],
				},
			],
		});

		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply merge
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(items, sequence)
		);
		expect(set).toEqual({
			type: 'set',
			regex: '\\uD83D\\uDE4F(?:\\uD83C\\uDFFB)?',
			sets: [
				createSequenceEmojiRegexItem([
					...items[0].items,
					createOptionalEmojiRegexItem(
						createRegexForNumbersSequence(
							splitUTF32Number(0x1f3fb)!
						)
					),
				]),
			],
			group: false,
		});
	});

	it('Multiple matches', () => {
		const items = [
			createEmojiRegexItemForNumbers([0x1234]),
			createRegexForNumbersSequence([0x1234, 0x1235]),
			createEmojiRegexItemForNumbers([0x1235]),
		];
		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 6,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 'full',
						},
						{
							index: 1,
							slice: 1,
						},
					],
				},
				{
					type: 'end',
					slices: [
						{
							index: 1,
							slice: 1,
						},
						{
							index: 2,
							slice: 'full',
						},
					],
				},
			],
		});

		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply first merge only
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(items, sequence)
		);

		expect(set).toEqual({
			type: 'set',
			regex: '\\u1234\\u1235?|\\u1235',
			sets: [
				createSequenceEmojiRegexItem([
					items[0],
					createOptionalEmojiRegexItem(items[2]),
				]),
				items[2],
			],
			group: false,
		});
	});

	it('Complex sequence', () => {
		const items = [
			// First 3 elements match, also last 2 elements create variations
			createRegexForNumbersSequence([
				0x1faf1, 0x1f3fb, 0x200d, 0x1faf2, 0x1f3fc,
			]),
			createRegexForNumbersSequence([
				0x1faf1, 0x1f3fb, 0x200d, 0x1faf1, 0x1f3fd,
			]),
			createRegexForNumbersSequence([
				0x1faf1, 0x1f3fb, 0x200d, 0x1faf1, 0x1f3fc,
			]),
			createRegexForNumbersSequence([
				0x1faf1, 0x1f3fb, 0x200d, 0x1faf2, 0x1f3fd,
			]),
			// Variation
			createRegexForNumbersSequence([0x1f64f]),
			createRegexForNumbersSequence([0x1f64f, 0x1f3fb]),
		];

		const merge = findSimilarRegexItemSequences(items);
		expect(merge).toEqual({
			score: 108,
			sequences: [
				{
					type: 'start',
					slices: [
						{
							index: 0,
							slice: 6,
						},
						{
							index: 1,
							slice: 6,
						},
						{
							index: 2,
							slice: 6,
						},
						{
							index: 3,
							slice: 6,
						},
					],
				},
			],
		});

		const sequence = merge?.sequences[0];
		if (!sequence) {
			throw new Error('Unexpected undefined sequence');
		}

		// Apply first merge only
		const set = createSetEmojiRegexItem(
			mergeSimilarRegexItemSequences(items, sequence)
		);

		const slicedSequence = (items[0] as SequenceEmojiItemRegex).items.slice(
			0,
			6
		);
		const slicedSet = createSetEmojiRegexItem([
			createSequenceEmojiRegexItem(
				(items[0] as SequenceEmojiItemRegex).items.slice(6)
			),
			createSequenceEmojiRegexItem(
				(items[1] as SequenceEmojiItemRegex).items.slice(6)
			),
			createSequenceEmojiRegexItem(
				(items[2] as SequenceEmojiItemRegex).items.slice(6)
			),
			createSequenceEmojiRegexItem(
				(items[3] as SequenceEmojiItemRegex).items.slice(6)
			),
		]);
		expect(slicedSet.regex).toBe(
			// Test mix separately to see if it is correct instead of parsing whole regex
			'\\uDEF1\\uD83C\\uDFFC|\\uDEF1\\uD83C\\uDFFD|\\uDEF2\\uD83C\\uDFFC|\\uDEF2\\uD83C\\uDFFD'
		);
		expect(set).toEqual({
			type: 'set',
			regex:
				// last 2 items (set items are sorted alphabetically),
				//  6 numbers from common chunks, grouped mix
				'\\uD83D\\uDE4F|\\uD83D\\uDE4F\\uD83C\\uDFFB|\\uD83E\\uDEF1\\uD83C\\uDFFB\\u200D\\uD83E(?:' +
				slicedSet.regex +
				')',
			sets: [
				items[4],
				items[5],
				createSequenceEmojiRegexItem([...slicedSequence, slicedSet]),
			],
			group: false,
		});
	});
});
