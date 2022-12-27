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
				regexp: 0,
			},
			{
				// Should be returned only once
				match: String.fromCodePoint(0x1f600),
				sequence: [0x1f600],
				keyword: '1f600',
				regexp: 0,
			},
			{
				match: String.fromCodePoint(0x1f603),
				sequence: [0x1f603],
				keyword: '1f603',
				regexp: 0,
			},
			{
				// Same as first, but without 'FE0F'
				match: '\u263A',
				sequence: [0x263a],
				keyword: '263a',
				regexp: 0,
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
					regexp: 0,
				},
				prev: text1,
				next: text2,
			},
			{
				match: {
					match: emoji2,
					sequence: [0x1f603],
					keyword: '1f603',
					regexp: 0,
				},
				prev: text2,
				next: text3,
			},
			{
				match: {
					match: emoji3,
					sequence: [0x1f600],
					keyword: '1f600',
					regexp: 0,
				},
				prev: text3,
				next: text4,
			},
			{
				match: {
					match: emoji4,
					sequence: [0x263a],
					keyword: '263a',
					regexp: 0,
				},
				prev: text4,
				next: text5,
			},
			{
				match: {
					match: emoji5,
					sequence: [0x263a],
					keyword: '263a',
					regexp: 0,
				},
				prev: text5,
				next: text6,
			},
		]);
	});

	it('Multiple regex', () => {
		const regex0 = createOptimisedRegex(['1F600', '1F603', '1F604']);
		const regex1 = createOptimisedRegex(['263A FE0F']);

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
		const matches = getEmojiMatchesInText([regex0, regex1], content);

		expect(matches).toEqual([
			{
				match: '\u263A\uFE0F',
				sequence: [0x263a],
				keyword: '263a',
				regexp: 1,
			},
			{
				// Should be returned only once
				match: String.fromCodePoint(0x1f600),
				sequence: [0x1f600],
				keyword: '1f600',
				regexp: 0,
			},
			{
				match: String.fromCodePoint(0x1f603),
				sequence: [0x1f603],
				keyword: '1f603',
				regexp: 0,
			},
			{
				// Same as first, but without 'FE0F'
				match: '\u263A',
				sequence: [0x263a],
				keyword: '263a',
				regexp: 1,
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
					regexp: 0,
				},
				prev: text1,
				next: text2,
			},
			{
				match: {
					match: emoji2,
					sequence: [0x1f603],
					keyword: '1f603',
					regexp: 0,
				},
				prev: text2,
				next: text3,
			},
			{
				match: {
					match: emoji3,
					sequence: [0x1f600],
					keyword: '1f600',
					regexp: 0,
				},
				prev: text3,
				next: text4,
			},
			{
				match: {
					match: emoji4,
					sequence: [0x263a],
					keyword: '263a',
					regexp: 1,
				},
				prev: text4,
				next: text5,
			},
			{
				match: {
					match: emoji5,
					sequence: [0x263a],
					keyword: '263a',
					regexp: 1,
				},
				prev: text5,
				next: text6,
			},
		]);
	});

	it('Sequences without spaces', () => {
		const regex = createOptimisedRegex(['1F63A', '1F638', '1F639']);

		const emoji1 = String.fromCodePoint(0x1f63a);
		const emoji2 = String.fromCodePoint(0x1f638);
		const emoji3 = String.fromCodePoint(0x1f639);

		const content = emoji1 + emoji2 + emoji3 + emoji1 + emoji2;
		const matches = getEmojiMatchesInText(regex, content);

		expect(matches).toEqual([
			{
				match: '\uD83D\uDE38',
				sequence: [0x1f638],
				keyword: '1f638',
				regexp: 0,
			},
			{
				match: '\uD83D\uDE39',
				sequence: [0x1f639],
				keyword: '1f639',
				regexp: 0,
			},
			{
				match: '\uD83D\uDE3A',
				sequence: [0x1f63a],
				keyword: '1f63a',
				regexp: 0,
			},
		]);

		const sortedMatches = sortEmojiMatchesInText(content, matches);
		expect(sortedMatches).toEqual([
			// Same order as in content
			{
				match: {
					match: '\uD83D\uDE3A',
					sequence: [0x1f63a],
					keyword: '1f63a',
					regexp: 0,
				},
				prev: '',
				next: '',
			},
			{
				match: {
					match: '\uD83D\uDE38',
					sequence: [0x1f638],
					keyword: '1f638',
					regexp: 0,
				},
				prev: '',
				next: '',
			},
			{
				match: {
					match: '\uD83D\uDE39',
					sequence: [0x1f639],
					keyword: '1f639',
					regexp: 0,
				},
				prev: '',
				next: '',
			},
			{
				match: {
					match: '\uD83D\uDE3A',
					sequence: [0x1f63a],
					keyword: '1f63a',
					regexp: 0,
				},
				prev: '',
				next: '',
			},
			{
				match: {
					match: '\uD83D\uDE38',
					sequence: [0x1f638],
					keyword: '1f638',
					regexp: 0,
				},
				prev: '',
				next: '',
			},
		]);
	});
});
