import { createOptimisedRegex } from '../lib/emoji/regex/create';
import {
	getEmojiMatchesInText,
	sortEmojiMatchesInText,
} from '../lib/emoji/replace/find';

describe('Finding emojis in text', () => {
	it('Simple regex', () => {
		const regexValue = createOptimisedRegex([
			'1F600',
			'1F603',
			'1F604',
			'263A FE0F',
		]);

		const text1 = 'E1.0 grinning face: ';
		const emoji1 = String.fromCodePoint(0x1f600);
		const text2 = '\nE0.6 grinning face with big eyes: ';
		const emoji2 = String.fromCodePoint(0x1f603);
		const text3 = 'E1.0 grinning face: ';
		const emoji3 = emoji1;
		const text4 = 'E0.6 smiling face: ';
		const emoji4 = '\u263A\uFE0F';
		const text5 = '(fully-qualified)\nE0.6 smiling face: ';
		const emoji5 = '\u263A';
		const text6 = '(unqualified)';

		const content =
			text1 +
			emoji1 +
			text2 +
			emoji2 +
			text3 +
			emoji3 +
			text4 +
			emoji4 +
			text5 +
			emoji5 +
			text6;
		const matches = getEmojiMatchesInText(regexValue, content);

		expect(matches).toEqual([
			{
				match: '\u263A\uFE0F',
				sequence: [0x263a],
				keyword: '263a',
			},
			{
				// Should be returned only once
				match: String.fromCodePoint(0x1f600),
				sequence: [0x1f600],
				keyword: '1f600',
			},
			{
				match: String.fromCodePoint(0x1f603),
				sequence: [0x1f603],
				keyword: '1f603',
			},
			{
				// Same as first, but without 'FE0F'
				match: '\u263A',
				sequence: [0x263a],
				keyword: '263a',
			},
		]);

		const sortedMatches = sortEmojiMatchesInText(content, matches);
		expect(sortedMatches).toEqual([
			// Same order as in content
			{
				match: {
					match: emoji1,
					sequence: [0x1f600],
					keyword: '1f600',
				},
				prev: text1,
				next: text2,
			},
			{
				match: {
					match: emoji2,
					sequence: [0x1f603],
					keyword: '1f603',
				},
				prev: text2,
				next: text3,
			},
			{
				match: {
					match: emoji3,
					sequence: [0x1f600],
					keyword: '1f600',
				},
				prev: text3,
				next: text4,
			},
			{
				match: {
					match: emoji4,
					sequence: [0x263a],
					keyword: '263a',
				},
				prev: text4,
				next: text5,
			},
			{
				match: {
					match: emoji5,
					sequence: [0x263a],
					keyword: '263a',
				},
				prev: text5,
				next: text6,
			},
		]);
	});
});
