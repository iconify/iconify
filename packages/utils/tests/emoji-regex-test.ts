import {
	getEmojiSequenceFromString,
	getSequenceFromEmojiStringOrKeyword,
} from '../lib/emoji/cleanup';
import {
	createOptimisedRegex,
	createOptimisedRegexForEmojiSequences,
} from '../lib/emoji/regex/create';

describe('Emoji regex matching', () => {
	function code(value: string): string {
		const sequence = getSequenceFromEmojiStringOrKeyword(value);
		return sequence.map((code) => String.fromCodePoint(code)).join('');
	}

	it('Simple regex', () => {
		const regexValue = createOptimisedRegex(['1F600', '1F603', '1F604']);

		const matches = `
E1.0 grinning face: ${String.fromCodePoint(0x1f600)}
E0.6 grinning face with big eyes: ${String.fromCodePoint(0x1f603)}
E1.0 grinning face: ${String.fromCodePoint(0x1f600)}
`.match(new RegExp(regexValue, 'g'));

		expect(matches?.length).toBe(3);
		expect(matches?.[0]).toBe(String.fromCodePoint(0x1f600));
		expect(matches?.[2]).toBe(String.fromCodePoint(0x1f600));
		expect(matches?.[1]).toBe(String.fromCodePoint(0x1f603));
	});

	it('Keywords', () => {
		const regexValue = createOptimisedRegex([
			':cat:',
			':gray_cat:',
			':tabby_cat:',
		]);

		const matches = `
Cat: :cat:
Tabby cat: :tabby_cat:
`.match(new RegExp(regexValue, 'g'));

		expect(matches?.length).toBe(2);
		expect(matches?.[0]).toBe(':cat:');
		expect(matches?.[1]).toBe(':tabby_cat:');
	});

	it('Sequences', () => {
		const regexValue = createOptimisedRegex([
			// Emoji with optional variation
			'263A FE0F',
			// Sequence and single emojis after it
			// Add multiple variations to test ranges
			'1F62E 200D 1F4A7',
			'1F62E 200D 1F4A8',
			'1F62E 200D 1F4A9',
			'1F62E',
			'1F62D',
			'1F62F',
			'1F4A8',
		]);

		const matches = `
E0.6 dashing away: ${String.fromCodePoint(0x1f4a8)}
E13.1 face exhaling: ${code('1f62e-200d-1f4a8')}
E1.0 face with open mouth: ${String.fromCodePoint(0x1f62e)}
E0.6 smiling face: ${code('263a-fe0f')} (icon)
E0.6 smiling face: ${String.fromCodePoint(0x263a)} (text)
`.match(new RegExp(regexValue, 'g'));

		expect(matches?.length).toBe(5);
		expect(matches?.[0]).toBe(code('1f4a8'));
		expect(matches?.[1]).toBe(code('1f62e 200d 1f4a8'));
		expect(matches?.[2]).toBe(String.fromCodePoint(0x1f62e));
		expect(matches?.[3]).toBe(code('263a fe0f'));
		expect(matches?.[4]).toBe(String.fromCodePoint(0x263a));
	});

	it('Skin tones', () => {
		const list = [
			'1f44b',
			'1f44b-1f3fb',
			'1f44b-1f3fc',
			'1f44b-1f3fd',
			'1f44b-1f3fe',
			'1f44b-1f3ff',
			'1f91a',
			'1f91a-1f3fb',
			'1f91a-1f3fc',
			'1f91a-1f3fd',
			'1f91a-1f3fe',
			'1f91a-1f3ff',
			'1f590-fe0f',
			'1f590',
			'1f590-1f3fb',
			'1f590-1f3fc',
			'1f590-1f3fd',
			'1f590-1f3fe',
			'1f590-1f3ff',
			'1f3fb',
			'1f3fc',
			'1f3fd',
			'1f3fe',
			'1f3ff',
		];
		const regexValue = createOptimisedRegex(list);

		const matches = `
E1.0 waving hand: medium skin tone: ${
			String.fromCodePoint(0x1f44b) + String.fromCodePoint(0x1f3fd)
		}
`.match(new RegExp(regexValue, 'g'));

		expect(matches?.length).toBe(1);
		expect(matches?.[0]).toBe(
			String.fromCodePoint(0x1f44b) + String.fromCodePoint(0x1f3fd)
		);
	});

	it('Bugged mix of sequences', () => {
		const fullList = [
			'1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc',
			'1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fc',
		];

		const regexValue = createOptimisedRegexForEmojiSequences(
			fullList.map((code) => getEmojiSequenceFromString(code))
		);

		const matches = code(
			'1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc'
		).match(new RegExp(regexValue, 'g'));

		expect(matches?.length).toBe(1);
		expect(matches?.[0]).toBe(
			code('1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc')
		);
	});
});
