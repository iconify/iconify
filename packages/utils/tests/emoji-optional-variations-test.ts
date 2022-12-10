/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { getEmojiSequenceFromString } from '../lib/emoji/cleanup';
import { getEmojiSequenceString } from '../lib/emoji/format';
import { parseEmojiTestFile } from '../lib/emoji/parse-test';
import { addOptionalEmojiVariations } from '../lib/emoji/variations';

describe('Optional variations of emoji sequences', () => {
	it('Variations without data', () => {
		const sequences = [
			// simple emoji, twice to check duplicates
			'1F601',
			'1F601 FE0F',
			// 2 simple emojis
			'1F635 200D 1F4AB',
			// simple emoji with variation
			'00A9 FE0F',
			// keycap with and without variation
			'0031 FE0F 20E3',
			'0033 20E3',
			// complex emojis
			'1F1E6 1F1F8',
			'1F3F4 E0067 E0062 E0065 E006E E0067 E007F',
			// mix of simple and complex, with and without variation
			'1F9D7 1F3FE 200D 2640 FE0F',
			'1F9D7 1F3FF 200D 2642 ',
		].map(getEmojiSequenceFromString);
		const results = addOptionalEmojiVariations(sequences);
		expect(
			results.map((sequence) =>
				getEmojiSequenceString(sequence, {
					separator: ' ',
					case: 'upper',
					format: 'utf-32',
					add0: true,
				})
			)
		).toEqual([
			// simple emoji
			'1F601 FE0F',
			// 2 simple emojis
			'1F635 FE0F 200D 1F4AB FE0F',
			// simple emoji with variation
			'00A9 FE0F',
			// keycap with and without variation
			'0031 FE0F 20E3',
			'0033 FE0F 20E3',
			// complex emojis
			'1F1E6 1F1F8',
			'1F3F4 E0067 E0062 E0065 E006E E0067 E007F',
			// mix of simple and complex, with and without variation
			'1F9D7 1F3FE 200D 2640 FE0F',
			'1F9D7 1F3FF 200D 2642 FE0F',
		]);
	});

	it('Variations with data', async () => {
		// Fetch emojis, cache it
		const version = '15.0';
		const source = `tests/fixtures/download-emoji-${version}.txt`;

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
						`https://unicode.org/Public/emoji/${version}/emoji-test.txt`
					)
				).text()
			).toString();
			await writeFile(source, data, 'utf8');
		}

		// Test content, unlink cache on failure
		if (data.indexOf(`# Version: ${version}`) === -1) {
			try {
				await unlink(source);
			} catch {
				//
			}
			return;
		}
		const testData = parseEmojiTestFile(data);

		const sequences = [
			// emoji without variation in test file
			'1F601',
			'1F635 200D 1F4AB',
			// emojis without variations in test file, but variations in source
			'1F60D FE0F',
			// emoji that has variation in test file
			'263A',
			// keycap
			'0030 20E3',
			'0034 FE0F 20E3',
			// complex emoji, exists in file
			'1F9D1 1F3FE 200D 2764 200D 1F9D1 1F3FB',
			// simple emoji, not in test file
			'1234',
			// fake keycap, not in test file
			'2345 20E3 200D 1235',
		].map(getEmojiSequenceFromString);
		const results = addOptionalEmojiVariations(sequences, testData);
		expect(
			results.map((sequence) =>
				getEmojiSequenceString(sequence, {
					separator: ' ',
					case: 'upper',
					format: 'utf-32',
					add0: true,
				})
			)
		).toEqual([
			// emoji without variation in test file
			'1F601',
			'1F635 200D 1F4AB',
			// emojis without variations in test file, but variations in source
			'1F60D',
			// emoji that has variation in test file
			'263A FE0F',
			// keycap
			'0030 FE0F 20E3',
			'0034 FE0F 20E3',
			// complex emoji, exists in file
			'1F9D1 1F3FE 200D 2764 FE0F 200D 1F9D1 1F3FB',
			// simple emoji, not in test file
			'1234 FE0F',
			// fake keycap, not in test file
			'2345 FE0F 20E3 200D 1235 FE0F',
		]);
	});
});
