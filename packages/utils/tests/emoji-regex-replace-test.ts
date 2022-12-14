import { createOptimisedRegex } from '../lib/emoji/regex/create';
import { findAndReplaceEmojisInText } from '../lib/emoji/replace/replace';

describe('Replacing emojis in text', () => {
	it('Simple and complex regex matches', () => {
		const grinningCatEmoji = String.fromCodePoint(0x1f63a);
		const alienEmoji = String.fromCodePoint(0x1f47d);
		const testEmoji =
			String.fromCodePoint(0x1f441) +
			String.fromCodePoint(0xfe0f) +
			String.fromCodePoint(0x200d) +
			String.fromCodePoint(0x1f5e8);

		const sequence = [
			'1f63a',
			'1f47d',
			// 2 emojis that can be sequences of each other
			'1F441 FE0F',
			'1F441 FE0F 200D 1F5E8 FE0F',
			'1F5E8 FE0F',
		];
		const regex = createOptimisedRegex(sequence);

		const text =
			'Grinning Cat: ' +
			grinningCatEmoji +
			', aliens: ' +
			alienEmoji +
			alienEmoji +
			alienEmoji +
			', Test: ' +
			testEmoji +
			'end!';

		// Counters
		let grinningCatCalled = 0;
		let alienCalled = 0;
		let testCalled = 0;
		const replaced = findAndReplaceEmojisInText(
			regex,
			text,
			(match, prev) => {
				switch (match.match) {
					case grinningCatEmoji: {
						expect(prev).toBe('Grinning Cat: ');
						grinningCatCalled++;
						return ':cat:';
					}

					case alienEmoji: {
						if (alienCalled) {
							expect(prev).toBe(
								'Grinning Cat: :cat:, aliens: ' +
									':alien:'.repeat(alienCalled)
							);
						}
						alienCalled++;
						return ':alien:';
					}

					case testEmoji: {
						testCalled++;
						return ':test:';
					}

					default: {
						throw new Error(
							`Unexpected match: ${JSON.stringify(match)}`
						);
					}
				}
			}
		);

		expect(grinningCatCalled).toBe(1);
		expect(alienCalled).toBe(3);
		expect(testCalled).toBe(1);
		expect(replaced).toBe(
			'Grinning Cat: :cat:, aliens: :alien::alien::alien:, Test: :test:end!'
		);
	});
});
