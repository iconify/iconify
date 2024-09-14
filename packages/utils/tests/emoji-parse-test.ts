import { readFile, writeFile, unlink } from 'node:fs/promises';
import { emojiVersion } from '../lib/emoji/data';
import { prepareEmojiForIconsList } from '../lib/emoji/parse';

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

	it('Preparing icon set without test data', () => {
		// One emoji
		expect(
			prepareEmojiForIconsList({
				'2615': 'hot-beverage',
			})
		).toEqual({
			icons: [
				{
					icon: 'hot-beverage',
					sequence: '2615',
				},
			],
			regex: '\\u2615\\uFE0F?',
		});

		// Multiple emojis
		expect(
			prepareEmojiForIconsList({
				'2615': 'hot-beverage',
				'1f1e6-1f1e8': 'flag-ascension-island',
				'1f1e6-1f1e9': 'flag-andorra',
				'1f1e6-1f1ea': 'flag-united-arab-emirates',
			})
		).toEqual({
			icons: [
				{
					icon: 'hot-beverage',
					sequence: '2615',
				},
				{
					icon: 'flag-ascension-island',
					sequence: '1f1e6-1f1e8',
				},
				{
					icon: 'flag-andorra',
					sequence: '1f1e6-1f1e9',
				},
				{
					icon: 'flag-united-arab-emirates',
					sequence: '1f1e6-1f1ea',
				},
			],
			regex: '\\uD83C\\uDDE6\\uD83C[\\uDDE8-\\uDDEA]|\\u2615\\uFE0F?',
		});
	});

	it('Preparing icon set with test data', () => {
		if (!data) {
			console.warn('Test skipped: test data is not available');
			return;
		}

		// One emoji
		expect(
			prepareEmojiForIconsList(
				{
					// Upper case
					'263A': 'smiling-face',
				},
				data
			)
		).toEqual({
			icons: [
				{
					icon: 'smiling-face',
					// Lower case
					sequence: '263a',
				},
			],
			regex: '\\u263A\\uFE0F?',
		});

		// One emoji that has components in test data
		expect(
			prepareEmojiForIconsList(
				{
					'270b': 'raised-hand',
				},
				data
			)
		).toEqual({
			icons: [
				{
					icon: 'raised-hand',
					sequence: '270b',
				},
				{
					icon: 'raised-hand',
					sequence: '270b-1f3fb',
				},
				{
					icon: 'raised-hand',
					sequence: '270b-1f3fc',
				},
				{
					icon: 'raised-hand',
					sequence: '270b-1f3fd',
				},
				{
					icon: 'raised-hand',
					sequence: '270b-1f3fe',
				},
				{
					icon: 'raised-hand',
					sequence: '270b-1f3ff',
				},
			],
			regex: '\\u270B(?:\\uD83C[\\uDFFB-\\uDFFF]|\\uFE0F?)',
		});

		// Multiple emojis, all without variations
		expect(
			prepareEmojiForIconsList(
				{
					'2615': 'hot-beverage',
					'1f1e6-1f1e8': 'flag-ascension-island',
					'1f1e6-1f1e9': 'flag-andorra',
					'1f1e6-1f1ea': 'flag-united-arab-emirates',
				},
				data
			)
		).toEqual({
			icons: [
				{
					icon: 'hot-beverage',
					sequence: '2615',
				},
				{
					icon: 'flag-ascension-island',
					sequence: '1f1e6-1f1e8',
				},
				{
					icon: 'flag-andorra',
					sequence: '1f1e6-1f1e9',
				},
				{
					icon: 'flag-united-arab-emirates',
					sequence: '1f1e6-1f1ea',
				},
			],
			regex: '\\uD83C\\uDDE6\\uD83C[\\uDDE8-\\uDDEA]|\\u2615\\uFE0F?',
		});
	});
});
