/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { getEmojiCodePoint, splitUTF32Number } from '../lib/emoji/convert';
import {
	startUTF32Pair1,
	startUTF32Pair2,
	endUTF32Pair,
	minUTF32,
} from '../lib/emoji/data';
import { parseEmojiTestFile } from '../lib/emoji/parse-test';

describe('Testing emoji code points', () => {
	it('Checking available ranges', async () => {
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

		// Get all emojis
		const utf16: Set<number> = new Set();
		const utf32: Set<number> = new Set();

		parseEmojiTestFile(data).forEach((sequence) => {
			sequence.forEach((code) => {
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
});
