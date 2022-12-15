/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { getEmojiSequenceString } from '../lib/emoji/format';
import { splitUTF32Number } from '../lib/emoji/convert';
import {
	startUTF32Pair1,
	startUTF32Pair2,
	endUTF32Pair,
	minUTF32,
	emojiVersion,
	vs16Emoji,
	EmojiComponentType,
} from '../lib/emoji/data';
import {
	parseEmojiTestFile,
	mapEmojiTestDataBySequence,
	EmojiTestDataItem,
} from '../lib/emoji/test/parse';
import { mapEmojiTestDataComponents } from '../lib/emoji/test/components';
import {
	splitEmojiNameVariations,
	SplitEmojiName,
	getEmojiComponentsMap,
} from '../lib/emoji/test/name';

describe('Testing unicode test data', () => {
	async function fetchEmojiTestData(): Promise<string | undefined> {
		// Fetch emojis, cache it
		const source = `tests/fixtures/download-emoji-${emojiVersion}.txt`;

		let data: string | undefined;
		try {
			data = await readFile(source, 'utf8');
		} catch {
			//
		}

		if (!data) {
			data = (
				await fetch(
					`https://unicode.org/Public/emoji/${emojiVersion}/emoji-test.txt`
				)
			)
				.text()
				.toString();
			await writeFile(source, data, 'utf8');
		}

		// Test content, unlink cache on failure
		if (data.indexOf(`# Version: ${emojiVersion}`) === -1) {
			try {
				await unlink(source);
			} catch {
				//
			}
			return;
		}
		return data;
	}

	function sequenceToString(
		sequence: (EmojiComponentType | number)[]
	): string {
		return sequence
			.map((item) =>
				typeof item === 'string'
					? item
					: item.toString(16).toLowerCase()
			)
			.join('-');
	}

	let data: string | undefined;

	beforeAll(async () => {
		data = await fetchEmojiTestData();
	});

	it('Checking available ranges', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		// Get all emojis
		const utf16: Set<number> = new Set();
		const utf32: Set<number> = new Set();

		parseEmojiTestFile(data).forEach((item) => {
			item.sequence.forEach((code) => {
				if (code < minUTF32) {
					utf16.add(code);
				} else {
					utf32.add(code);
				}
			});
		});

		// Code points should not be empty
		expect(utf16.size).toBeGreaterThan(0);
		expect(utf32.size).toBeGreaterThan(0);

		// Get min/max values
		interface Range {
			min: number;
			max: number;
		}

		function add(code: number, range: Range | undefined): Range {
			if (!range) {
				return {
					min: code,
					max: code,
				};
			}
			range.min = Math.min(range.min, code);
			range.max = Math.max(range.max, code);
			return range;
		}

		// ... for UTF-16 code points
		let utf16Range: Range | undefined;
		utf16.forEach((code) => {
			if (code > startUTF32Pair1 && code < endUTF32Pair) {
				throw new Error(`UTF16 in UTF32 range: ${code}`);
			}
			utf16Range = add(code, utf16Range);
		});

		// ... for UTF-32 code points
		let utf32FirstRange: Range | undefined;
		let utf32SecondRange: Range | undefined;
		utf32.forEach((code) => {
			const pair = splitUTF32Number(code);
			if (pair) {
				utf32FirstRange = add(pair[0], utf32FirstRange);
				utf32SecondRange = add(pair[1], utf32SecondRange);
			} else {
				throw new Error(`Unexpected item in UTF32 set: ${code}`);
			}
		});

		/*
		// Dump ranges
		function dump(item: Range | undefined): string {
			if (!item) {
				return 'undefined';
			}
			return `${item.min} - ${item.max} (0x${item.min
				.toString(16)
				.toUpperCase()} - 0x${item.max.toString(16).toUpperCase()})`;
		}
		console.log('UTF16:', dump(utf16Range));
		console.log('UTF32:', dump(utf32FirstRange), dump(utf32SecondRange));
		*/

		// Check UTF-32 emoji ranges
		expect(utf32FirstRange).toBeDefined();
		expect(utf32FirstRange!.min).toBeGreaterThanOrEqual(startUTF32Pair1);
		expect(utf32FirstRange!.max).toBeLessThan(startUTF32Pair2);

		expect(utf32SecondRange).toBeDefined();
		expect(utf32SecondRange!.min).toBeGreaterThanOrEqual(startUTF32Pair2);
		expect(utf32SecondRange!.max).toBeLessThan(endUTF32Pair);
	});

	it('Splitting emoji names', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const mappedTestData = mapEmojiTestDataBySequence(
			testData,
			getEmojiSequenceString
		);
		const components = mapEmojiTestDataComponents(
			mappedTestData,
			getEmojiSequenceString
		);

		// Few items without variations
		let item: EmojiTestDataItem;
		let baseItem: EmojiTestDataItem;
		[
			'1f600',
			'1f636-200d-1f32b-fe0f',
			'1f62e-200d-1f4a8',
			'1f5ef-fe0f',
			'1f44b',
		].forEach((key) => {
			item = mappedTestData[key];
			expect(
				splitEmojiNameVariations(item.name, item.sequence, components)
			).toEqual({
				base: item.name,
				key: item.name,
			});
		});

		// One skin tone
		baseItem = mappedTestData['1f590'];
		item = mappedTestData['1f590-1f3fb'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 1,
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
			],
		});
		item = mappedTestData['1f590-1f3ff'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 1,
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
			],
		});

		// Flag, no base item
		item = mappedTestData['1f1e6-1f1f6'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: 'flag',
			key: item.name,
			components: 0,
			variations: ['Antarctica'],
		});

		// Keycap, no base item
		item = mappedTestData['23-fe0f-20e3'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: 'keycap',
			key: item.name,
			components: 0,
			variations: ['#'],
		});

		// Variations of same base item
		baseItem = mappedTestData['1f468'];
		item = mappedTestData['1f468-1f3fd'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 1,
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
			],
		});
		item = mappedTestData['1f468-200d-1f9b0'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 1,
			variations: [
				{
					index: 2,
					type: 'hair-style',
				},
			],
		});
		item = mappedTestData['1f468-1f3fd-200d-1f9b0'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 2,
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
				{
					index: 3,
					type: 'hair-style',
				},
			],
		});

		// Variations of same base item with custom stuff
		baseItem = mappedTestData['1f48f'];
		item = mappedTestData['1f48f-1f3fd'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			components: 1,
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
			],
		});
		item = mappedTestData['1f469-200d-2764-200d-1f48b-200d-1f468'];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: item.name,
			components: 0,
			variations: ['woman', 'man'],
		});
		item =
			mappedTestData[
				'1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd'
			];
		expect(
			splitEmojiNameVariations(item.name, item.sequence, components)
		).toEqual({
			base: baseItem.name,
			key: baseItem.name,
			// key: baseItem.name + ': person, person',
			components: 2,
			variations: [
				'person',
				'person',
				{
					index: 1,
					type: 'skin-tone',
				},
				{
					index: 9,
					type: 'skin-tone',
				},
			],
		});
	});

	it('Checking parent items for all variations', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const mappedTestData = mapEmojiTestDataBySequence(
			testData,
			getEmojiSequenceString
		);
		const components = mapEmojiTestDataComponents(
			mappedTestData,
			getEmojiSequenceString
		);

		// Parse all items
		// [key][sequence] = sample item
		interface Item {
			item: EmojiTestDataItem;
			split: SplitEmojiName;
			components: EmojiComponentType[];
		}
		type ItemsList = Record<string, Item>;
		const results = Object.create(null) as Record<string, ItemsList>;
		testData.forEach((item) => {
			const split = splitEmojiNameVariations(
				item.name,
				item.sequence,
				components
			);
			const parent =
				results[split.key] ||
				(results[split.key] = Object.create(null) as ItemsList);

			// Create unique key based on component types
			let sequenceKey = 'default';
			const itemComponents: EmojiComponentType[] = [];
			if (split.components) {
				split.variations?.forEach((item) => {
					if (typeof item !== 'string') {
						itemComponents.push(item.type);
					}
				});
				if (itemComponents.length) {
					sequenceKey = '[' + itemComponents.join(', ') + ']';
				}
			}

			const prevItem = parent[sequenceKey];
			if (!prevItem) {
				parent[sequenceKey] = {
					item,
					split,
					components: itemComponents,
				};
				return;
			}

			// Compare items
			const cleanSequence = (sequence: number[]): string => {
				return getEmojiSequenceString(
					sequence.filter(
						(num) =>
							num !== vs16Emoji && !components.converted.has(num)
					)
				);
			};

			if (
				cleanSequence(prevItem.item.sequence) !==
				cleanSequence(item.sequence)
			) {
				console.log(prevItem.item);
				console.log(item);
				throw new Error(
					`Mismatched items with same key: ${sequenceKey}`
				);
			}

			if (item.sequence.length > prevItem.item.sequence.length) {
				// Keep longer sequence
				parent[sequenceKey] = {
					item,
					split,
					components: itemComponents,
				};
			}
		});

		// Validate all items
		const allVariations: Set<string> = new Set();
		for (const key in results) {
			const items = results[key];
			const stringify = (value: EmojiComponentType[]) =>
				'[' + value.join(',') + ']';

			const itemComponents = Object.create(null) as Record<
				string,
				EmojiComponentType[]
			>;
			const tested: Set<string> = new Set();
			for (const key2 in items) {
				const item = items[key2];
				const componentsValue = stringify(item.components);
				allVariations.add(componentsValue);
				if (componentsValue in itemComponents) {
					console.log(items);
					throw new Error(
						`Duplicate "${componentsValue}" variations`
					);
				}
				itemComponents[componentsValue] = item.components;
			}

			// Make sure all items exist
			const checkParents = (list: EmojiComponentType[]) => {
				const skippedTypes = new Set();
				for (let i = 0; i < list.length; i++) {
					const sequence = list.slice(0, i).concat(list.slice(i + 1));
					const key = stringify(sequence);
					const skipped = list[i];
					const parent = itemComponents[key];
					if (!parent) {
						// Missing parent
						console.log(items);
						throw new Error(
							`Missing parent for "${key}" variation`
						);
					}

					if (!skippedTypes.has(skipped)) {
						skippedTypes.add(skipped);
						const testKey = key + ':' + skipped;
						if (tested.has(testKey)) {
							// Multiple child variations ???
							console.log(items);
							throw new Error(
								`Multiple parents for "${testKey}" variation`
							);
						}
						tested.add(testKey);
					}
				}
			};
			for (const stringified in itemComponents) {
				checkParents(itemComponents[stringified]);
			}
		}
		// console.log(allVariations);
	});

	it('Testing emoji components map', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const map = getEmojiComponentsMap(testData);

		// Simple item: should not exists
		const item1 = map.find(
			(item) => sequenceToString(item.sequence) === '1f601'
		);
		expect(item1).toBeUndefined();

		// Item with skin tones
		const item2 = map.find(
			(item) => sequenceToString(item.sequence) === '1f596'
		);
		expect(item2).toEqual({
			name: 'vulcan salute',
			sequence: [0x1f596],
			children: {
				'skin-tone': {
					name: 'vulcan salute: {skin-tone-0}',
					sequence: [0x1f596, 'skin-tone'],
				},
			},
		});

		// Item with hair style and skin tones
		const item3 = map.find(
			(item) => sequenceToString(item.sequence) === '1f469'
		);
		expect(item3).toEqual({
			name: 'woman',
			sequence: [0x1f469],
			children: {
				'skin-tone': {
					name: 'woman: {skin-tone-0}',
					sequence: [0x1f469, 'skin-tone'],
					children: {
						'hair-style': {
							name: 'woman: {skin-tone-0}, {hair-style-1}',
							sequence: [
								0x1f469,
								'skin-tone',
								0x200d,
								'hair-style',
							],
						},
					},
				},
				'hair-style': {
					name: 'woman: {hair-style-0}',
					sequence: [0x1f469, 0x200d, 'hair-style'],
				},
			},
		});
	});
});
