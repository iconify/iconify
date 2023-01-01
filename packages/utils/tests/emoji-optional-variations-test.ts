import { getEmojiSequenceFromString } from '../lib/emoji/cleanup';
import { getEmojiSequenceString } from '../lib/emoji/format';
import { getQualifiedEmojiVariations } from '../lib/emoji/test/variations';

describe('Qualified variations of emoji sequences', () => {
	it('Variations without test data', () => {
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
		].map((source) => {
			const sequence = getEmojiSequenceFromString(source);
			return {
				source,
				sequence,
			};
		});

		const results = getQualifiedEmojiVariations(sequences);
		expect(
			results.map((item) =>
				getEmojiSequenceString(item.sequence, {
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
			'1F9D7 FE0F 1F3FE 200D 2640 FE0F',
			'1F9D7 FE0F 1F3FF 200D 2642 FE0F',
		]);
	});
});
