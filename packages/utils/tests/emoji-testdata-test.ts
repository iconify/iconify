/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { splitUTF32Number } from '../lib/emoji/convert';
import {
	startUTF32Pair1,
	startUTF32Pair2,
	endUTF32Pair,
	minUTF32,
	emojiVersion,
} from '../lib/emoji/data';
import { EmojiTestDataItem, parseEmojiTestFile } from '../lib/emoji/test/parse';
import {
	mapEmojiTestDataComponents,
	replaceEmojiComponentsInCombinedSequence,
} from '../lib/emoji/test/components';
import { splitEmojiNameVariations } from '../lib/emoji/test/name';
import { combineSimilarEmojiTestData } from '../lib/emoji/test/similar';
import { getEmojiTestDataTree } from '../lib/emoji/test/tree';
import { findMissingEmojis } from '../lib/emoji/test/missing';

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
				await (
					await fetch(
						`https://unicode.org/Public/emoji/${emojiVersion}/emoji-test.txt`
					)
				).text()
			).toString();
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

		Object.values(parseEmojiTestFile(data)).forEach((item) => {
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

	it('Splitting emoji names and variations', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const components = mapEmojiTestDataComponents(testData);

		// Test splitting name
		expect(
			splitEmojiNameVariations(
				'people holding hands: medium-light skin tone',
				[129489, 127996, 8205, 129309, 8205, 129489, 127996],
				components
			)
		).toEqual({
			base: 'people holding hands',
			key: 'people holding hands',
			variations: [
				{
					index: 1,
					type: 'skin-tone',
				},
				{
					index: 6,
					type: 'skin-tone',
				},
			],
			components: 2,
		});

		// Split data
		const splitTestData = combineSimilarEmojiTestData(testData, components);

		// Check basic items
		expect(testData['1f600']).toBeDefined();
		const sourceItem1 = testData['1f600'];

		expect(splitTestData['1f600']).toEqual({
			...sourceItem1,
			sequence: [0x1f600],
			sequenceKey: '1f600',
			name: {
				// Same name and key
				base: sourceItem1.name,
				key: sourceItem1.name,
			},
		});

		// Basic item with variation
		expect(testData['263a']).toBeDefined();
		const sourceItem2 = testData['263a'];

		expect(splitTestData['263a']).toEqual({
			...sourceItem2,
			// Make sure sequence contains 'FE0F', but key does not
			sequence: [0x263a, 0xfe0f],
			sequenceKey: '263a',
			name: {
				// Same name and key
				base: sourceItem2.name,
				key: sourceItem2.name,
			},
		});

		// Skin tone
		expect(testData['1f44b-1f3fb']).toBeDefined();
		expect(splitTestData['1f44b-1f3fb']).toBeUndefined();
		expect(splitTestData['1f44b-skin-tone']).toBeDefined();
		const sourceItem3 = testData['1f44b-1f3ff'];

		expect(splitTestData['1f44b-skin-tone']).toEqual({
			...sourceItem3,
			// Sequence should contain 'skin-tone'
			sequence: [0x1f44b, 'skin-tone'],
			sequenceKey: '1f44b-skin-tone',
			name: {
				// Name without skin tone
				base: 'waving hand',
				key: 'waving hand',
				components: 1,
				variations: [
					{
						index: 1,
						type: 'skin-tone',
					},
				],
			},
		});

		// Not a skin tone
		expect(testData['30-20e3']).toBeDefined();
		const sourceItem4 = testData['30-20e3'];

		expect(splitTestData['30-20e3']).toEqual({
			...sourceItem4,
			sequenceKey: '30-20e3',
			name: {
				// Name without number tone
				base: 'keycap',
				// Key should contain variation
				key: 'keycap: 0',
				variations: ['0'],
			},
		});

		// Items should not have skin tones
		for (const key in splitTestData) {
			const item = splitTestData[key];
			if (item.sequenceKey.indexOf('1f3fc') !== -1) {
				console.error(key, item);
				expect(item.sequenceKey.indexOf('1f3fc')).toBe(-1);
			}
		}
	});

	it('Merging variations', () => {
		// Nothing to replace
		expect(replaceEmojiComponentsInCombinedSequence([0x1f3c3], {})).toEqual(
			[0x1f3c3]
		);

		// One skin tone
		expect(
			replaceEmojiComponentsInCombinedSequence([0x1f3c3, 'skin-tone'], {
				'skin-tone': [0x1f3fe],
			})
		).toEqual([0x1f3c3, 0x1f3fe]);

		// Hair style
		expect(
			replaceEmojiComponentsInCombinedSequence(
				[0x1f468, 0x200d, 'hair-style'],
				{
					'skin-tone': [0x1f3fe], // unused
					'hair-style': [0x1f9b2],
				}
			)
		).toEqual([0x1f468, 0x200d, 0x1f9b2]);

		// Mix
		expect(
			replaceEmojiComponentsInCombinedSequence(
				[0x1f468, 'skin-tone', 0x200d, 'hair-style'],
				{
					'skin-tone': [0x1f3fe],
					'hair-style': [0x1f9b1],
				}
			)
		).toEqual([0x1f468, 0x1f3fe, 0x200d, 0x1f9b1]);

		// Mutiple skin tones
		expect(
			replaceEmojiComponentsInCombinedSequence(
				[
					0x1f469,
					'skin-tone',
					0x200d,
					0x1f91d,
					0x200d,
					0x1f468,
					'skin-tone',
				],
				{
					'skin-tone': [0x1f3fc, 0x1f3ff],
				}
			)
		).toEqual([
			0x1f469, 0x1f3fc, 0x200d, 0x1f91d, 0x200d, 0x1f468, 0x1f3ff,
		]);

		// Double skin tones
		expect(
			replaceEmojiComponentsInCombinedSequence(
				[
					0x1f469,
					'skin-tone',
					0x200d,
					0x1f91d,
					0x200d,
					0x1f468,
					'skin-tone',
				],
				{
					'skin-tone': [0x1f3fc],
				}
			)
		).toEqual([
			0x1f469, 0x1f3fc, 0x200d, 0x1f91d, 0x200d, 0x1f468, 0x1f3fc,
		]);
	});

	it('Checking parent items for all variations', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const components = mapEmojiTestDataComponents(testData);

		// Split data and get tree
		const splitTestData = combineSimilarEmojiTestData(testData, components);
		const tree = getEmojiTestDataTree(splitTestData);

		// Simple item
		expect(tree['person running']).toEqual({
			item: {
				group: 'People & Body',
				subgroup: 'person-activity',
				sequence: [0x1f3c3],
				emoji: String.fromCodePoint(0x1f3c3),
				status: 'fully-qualified',
				version: 'E0.6',
				name: {
					base: 'person running',
					key: 'person running',
				},
				sequenceKey: '1f3c3',
				components: {
					'skin-tone': 0,
					'hair-style': 0,
				},
				componentsKey: '',
			},
			children: {
				'skin-tone': {
					item: {
						group: 'People & Body',
						subgroup: 'person-activity',
						sequence: [0x1f3c3, 'skin-tone'],
						emoji:
							String.fromCodePoint(0x1f3c3) +
							String.fromCodePoint(0x1f3ff),
						status: 'fully-qualified',
						version: 'E1.0',
						name: {
							base: 'person running',
							key: 'person running',
							components: 1,
							variations: [
								{
									type: 'skin-tone',
									index: 1,
								},
							],
						},
						sequenceKey: '1f3c3-skin-tone',
						components: {
							'skin-tone': 1,
							'hair-style': 0,
						},
						componentsKey: '[skin-tone]',
					},
				},
			},
		});

		// Skin tone and hair style
		expect(tree['man']).toEqual({
			item: {
				group: 'People & Body',
				subgroup: 'person',
				sequence: [0x1f468],
				emoji: String.fromCodePoint(0x1f468),
				status: 'fully-qualified',
				version: 'E0.6',
				name: {
					base: 'man',
					key: 'man',
				},
				sequenceKey: '1f468',
				components: {
					'skin-tone': 0,
					'hair-style': 0,
				},
				componentsKey: '',
			},
			children: {
				'hair-style': {
					item: {
						group: 'People & Body',
						subgroup: 'person',
						sequence: [0x1f468, 0x200d, 'hair-style'],
						emoji:
							String.fromCodePoint(0x1f468) +
							String.fromCodePoint(0x200d) +
							String.fromCodePoint(0x1f9b2),
						status: 'fully-qualified',
						version: 'E11.0',
						name: {
							base: 'man',
							key: 'man',
							components: 1,
							variations: [
								{
									type: 'hair-style',
									index: 2,
								},
							],
						},
						sequenceKey: '1f468-200d-hair-style',
						components: {
							'skin-tone': 0,
							'hair-style': 1,
						},
						componentsKey: '[hair-style]',
					},
					children: {
						'skin-tone': {
							item: {
								group: 'People & Body',
								subgroup: 'person',
								sequence: [
									0x1f468,
									'skin-tone',
									0x200d,
									'hair-style',
								],
								emoji:
									String.fromCodePoint(0x1f468) +
									String.fromCodePoint(0x1f3ff) +
									String.fromCodePoint(0x200d) +
									String.fromCodePoint(0x1f9b2),
								status: 'fully-qualified',
								version: 'E11.0',
								name: {
									base: 'man',
									key: 'man',
									components: 2,
									variations: [
										{
											type: 'skin-tone',
											index: 1,
										},
										{
											type: 'hair-style',
											index: 3,
										},
									],
								},
								sequenceKey: '1f468-skin-tone-200d-hair-style',
								components: {
									'skin-tone': 1,
									'hair-style': 1,
								},
								componentsKey: '[hair-style,skin-tone]',
							},
						},
					},
				},
				'skin-tone': {
					item: {
						group: 'People & Body',
						subgroup: 'person',
						sequence: [0x1f468, 'skin-tone'],
						emoji:
							String.fromCodePoint(0x1f468) +
							String.fromCodePoint(0x1f3ff),
						status: 'fully-qualified',
						version: 'E1.0',
						name: {
							base: 'man',
							key: 'man',
							components: 1,
							variations: [
								{
									type: 'skin-tone',
									index: 1,
								},
							],
						},
						sequenceKey: '1f468-skin-tone',
						components: {
							'skin-tone': 1,
							'hair-style': 0,
						},
						componentsKey: '[skin-tone]',
					},
					children: {
						'hair-style': {
							item: {
								group: 'People & Body',
								subgroup: 'person',
								sequence: [
									0x1f468,
									'skin-tone',
									0x200d,
									'hair-style',
								],
								emoji:
									String.fromCodePoint(0x1f468) +
									String.fromCodePoint(0x1f3ff) +
									String.fromCodePoint(0x200d) +
									String.fromCodePoint(0x1f9b2),
								status: 'fully-qualified',
								version: 'E11.0',
								name: {
									base: 'man',
									key: 'man',
									components: 2,
									variations: [
										{
											type: 'skin-tone',
											index: 1,
										},
										{
											type: 'hair-style',
											index: 3,
										},
									],
								},
								sequenceKey: '1f468-skin-tone-200d-hair-style',
								components: {
									'skin-tone': 1,
									'hair-style': 1,
								},
								componentsKey: '[hair-style,skin-tone]',
							},
						},
					},
				},
			},
		});

		// Double skin tone
		expect(tree['people holding hands']).toEqual({
			item: {
				group: 'People & Body',
				subgroup: 'family',
				sequence: [0x1f9d1, 0x200d, 0x1f91d, 0x200d, 0x1f9d1],
				emoji:
					String.fromCodePoint(0x1f9d1) +
					String.fromCodePoint(0x200d) +
					String.fromCodePoint(0x1f91d) +
					String.fromCodePoint(0x200d) +
					String.fromCodePoint(0x1f9d1),
				status: 'fully-qualified',
				version: 'E12.0',
				name: {
					base: 'people holding hands',
					key: 'people holding hands',
				},
				sequenceKey: '1f9d1-200d-1f91d-200d-1f9d1',
				components: {
					'skin-tone': 0,
					'hair-style': 0,
				},
				componentsKey: '',
			},
			children: {
				'skin-tone': {
					item: {
						group: 'People & Body',
						subgroup: 'family',
						sequence: [
							0x1f9d1,
							'skin-tone',
							0x200d,
							0x1f91d,
							0x200d,
							0x1f9d1,
							'skin-tone',
						],
						emoji:
							String.fromCodePoint(0x1f9d1) +
							String.fromCodePoint(0x1f3ff) +
							String.fromCodePoint(0x200d) +
							String.fromCodePoint(0x1f91d) +
							String.fromCodePoint(0x200d) +
							String.fromCodePoint(0x1f9d1) +
							String.fromCodePoint(0x1f3ff),
						status: 'fully-qualified',
						version: 'E12.0',
						name: {
							base: 'people holding hands',
							key: 'people holding hands',
							components: 2,
							variations: [
								{
									type: 'skin-tone',
									index: 1,
								},
								{
									type: 'skin-tone',
									index: 6,
								},
							],
						},
						sequenceKey:
							'1f9d1-skin-tone-200d-1f91d-200d-1f9d1-skin-tone',
						components: {
							'skin-tone': 2,
							'hair-style': 0,
						},
						componentsKey: '[skin-tone,skin-tone]',
					},
					children: {
						'skin-tone': {
							item: {
								group: 'People & Body',
								subgroup: 'family',
								sequence: [
									0x1f9d1,
									'skin-tone',
									0x200d,
									0x1f91d,
									0x200d,
									0x1f9d1,
									'skin-tone',
								],
								emoji:
									String.fromCodePoint(0x1f9d1) +
									String.fromCodePoint(0x1f3ff) +
									String.fromCodePoint(0x200d) +
									String.fromCodePoint(0x1f91d) +
									String.fromCodePoint(0x200d) +
									String.fromCodePoint(0x1f9d1) +
									String.fromCodePoint(0x1f3ff),
								status: 'fully-qualified',
								version: 'E12.0',
								name: {
									base: 'people holding hands',
									key: 'people holding hands',
									components: 2,
									variations: [
										{
											type: 'skin-tone',
											index: 1,
										},
										{
											type: 'skin-tone',
											index: 6,
										},
									],
								},
								sequenceKey:
									'1f9d1-skin-tone-200d-1f91d-200d-1f9d1-skin-tone',
								components: {
									'skin-tone': 2,
									'hair-style': 0,
								},
								componentsKey: '[skin-tone,skin-tone]',
							},
						},
					},
				},
			},
		});
	});

	it('Finding missing emojis', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		const testData = parseEmojiTestFile(data);
		const components = mapEmojiTestDataComponents(testData);

		// Split data and get tree
		const splitTestData = combineSimilarEmojiTestData(testData, components);
		const tree = getEmojiTestDataTree(splitTestData);

		// Use test data
		interface TestListItem extends EmojiTestDataItem {
			// Add it for easier testing
			sequenceKey: string;
		}
		const testList: TestListItem[] = [];
		for (const sequenceKey in testData) {
			testList.push({
				...testData[sequenceKey],
				sequenceKey,
			});
		}
		const missing = new Set(
			findMissingEmojis(testList, tree).map((item) => item.sequenceKey)
		);
		expect(missing.size).toBe(30);
		expect(missing.has('1faf1-1f3fb-200d-1faf2-1f3fb')).toBe(true);
		expect(missing.has('1faf1-1f3fb-200d-1faf2-1f3fc')).toBe(false);

		// Only one emoji
		const missing2 = findMissingEmojis(
			[
				// Main icon
				{
					iconName: 'kiss',
					sequence: [0x1f48f],
					sequenceKey: '1f48f',
				},
				// Only one skin tone to test sources for double skin tone
				{
					iconName: 'kiss-medium-skin-tone',
					sequence: [0x1f48f, 0x1f3fd],
					sequenceKey: '1f48f-1f3fd',
				},
			],
			tree
		);

		// Should be 29 missing emojis
		expect(missing2.length).toBe(29);
		const missing2Map = {} as Record<string, string>;
		missing2.forEach((item) => {
			missing2Map[item.sequenceKey] = item.iconName;
		});
		expect(missing2Map).toEqual({
			'1f48f-1f3fb': 'kiss',
			'1f48f-1f3fc': 'kiss',
			'1f9d1-1f3fd-200d-2764-200d-1f48b-200d-1f9d1-1f3fb':
				'kiss-medium-skin-tone',
			'1f9d1-1f3fd-200d-2764-200d-1f48b-200d-1f9d1-1f3fc':
				'kiss-medium-skin-tone',
			'1f9d1-1f3fd-200d-2764-200d-1f48b-200d-1f9d1-1f3fd':
				'kiss-medium-skin-tone',
			'1f9d1-1f3fd-200d-2764-200d-1f48b-200d-1f9d1-1f3fe':
				'kiss-medium-skin-tone',
			'1f9d1-1f3fd-200d-2764-200d-1f48b-200d-1f9d1-1f3ff':
				'kiss-medium-skin-tone',
			'1f48f-1f3fe': 'kiss',
			'1f48f-1f3ff': 'kiss',
			'1f9d1-1f3fb-200d-2764-200d-1f48b-200d-1f9d1-1f3fb': 'kiss',
			'1f9d1-1f3fb-200d-2764-200d-1f48b-200d-1f9d1-1f3fc': 'kiss',
			'1f9d1-1f3fb-200d-2764-200d-1f48b-200d-1f9d1-1f3fd': 'kiss',
			'1f9d1-1f3fb-200d-2764-200d-1f48b-200d-1f9d1-1f3fe': 'kiss',
			'1f9d1-1f3fb-200d-2764-200d-1f48b-200d-1f9d1-1f3ff': 'kiss',
			'1f9d1-1f3fc-200d-2764-200d-1f48b-200d-1f9d1-1f3fb': 'kiss',
			'1f9d1-1f3fc-200d-2764-200d-1f48b-200d-1f9d1-1f3fc': 'kiss',
			'1f9d1-1f3fc-200d-2764-200d-1f48b-200d-1f9d1-1f3fd': 'kiss',
			'1f9d1-1f3fc-200d-2764-200d-1f48b-200d-1f9d1-1f3fe': 'kiss',
			'1f9d1-1f3fc-200d-2764-200d-1f48b-200d-1f9d1-1f3ff': 'kiss',
			'1f9d1-1f3fe-200d-2764-200d-1f48b-200d-1f9d1-1f3fb': 'kiss',
			'1f9d1-1f3fe-200d-2764-200d-1f48b-200d-1f9d1-1f3fc': 'kiss',
			'1f9d1-1f3fe-200d-2764-200d-1f48b-200d-1f9d1-1f3fd': 'kiss',
			'1f9d1-1f3fe-200d-2764-200d-1f48b-200d-1f9d1-1f3fe': 'kiss',
			'1f9d1-1f3fe-200d-2764-200d-1f48b-200d-1f9d1-1f3ff': 'kiss',
			'1f9d1-1f3ff-200d-2764-200d-1f48b-200d-1f9d1-1f3fb': 'kiss',
			'1f9d1-1f3ff-200d-2764-200d-1f48b-200d-1f9d1-1f3fc': 'kiss',
			'1f9d1-1f3ff-200d-2764-200d-1f48b-200d-1f9d1-1f3fd': 'kiss',
			'1f9d1-1f3ff-200d-2764-200d-1f48b-200d-1f9d1-1f3fe': 'kiss',
			'1f9d1-1f3ff-200d-2764-200d-1f48b-200d-1f9d1-1f3ff': 'kiss',
		});
	});
});
