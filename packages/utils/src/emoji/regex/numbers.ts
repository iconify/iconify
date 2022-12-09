import { splitUTF32Number } from '../convert';
import {
	createOptionalEmojiRegexItem,
	createSequenceEmojiRegexItem,
	createSetEmojiRegexItem,
	createUTF16EmojiRegexItem,
	EmojiItemRegex,
	OptionalEmojiItemRegex,
	SequenceEmojiItemRegex,
	SetEmojiItemRegex,
	UTF16EmojiItemRegex,
} from './base';
import { vs16Emoji } from '../data';

/**
 * Create regex item for set of numbers
 */
export function createEmojiRegexItemForNumbers(
	numbers: number[]
): UTF16EmojiItemRegex | SequenceEmojiItemRegex | SetEmojiItemRegex {
	// Separate UTF-16 and UTF-32
	interface UTF32FirstNumber {
		first: number;
		second: number[];
		numbers: number[];
	}
	const utf32: UTF32FirstNumber[] = [];
	const utf16: number[] = [];

	numbers.sort((a, b) => a - b);

	let lastNumber: number | undefined;
	for (let i = 0; i < numbers.length; i++) {
		const number = numbers[i];
		if (number === lastNumber) {
			continue;
		}
		lastNumber = number;

		const split = splitUTF32Number(number);
		if (!split) {
			utf16.push(number);
			continue;
		}

		const [first, second] = split;
		const item = utf32.find((item) => item.first === first);
		if (item) {
			item.second.push(second);
			item.numbers.push(number);
		} else {
			utf32.push({
				first,
				second: [second],
				numbers: [number],
			});
		}
	}

	const results: (UTF16EmojiItemRegex | SequenceEmojiItemRegex)[] = [];

	// Merge UTF-16
	if (utf16.length) {
		results.push(createUTF16EmojiRegexItem(utf16));
	}

	// Merge UTF-32
	if (utf32.length) {
		// Create map of first and second chunks, joining by common second chunks
		interface UTF32Item {
			second: UTF16EmojiItemRegex;
			first: number[];
			numbers: number[];
		}
		const utf32Set: UTF32Item[] = [];

		for (let i = 0; i < utf32.length; i++) {
			const item = utf32[i];
			const secondRegex = createUTF16EmojiRegexItem(item.second);

			// Find matching elements
			const listItem = utf32Set.find(
				(item) => item.second.regex === secondRegex.regex
			);
			if (listItem) {
				// Found multiple items with the same last set
				listItem.first.push(item.first);
				listItem.numbers = [...listItem.numbers, ...item.numbers];
			} else {
				utf32Set.push({
					second: secondRegex,
					first: [item.first],
					numbers: [...item.numbers],
				});
			}
		}

		// Create regex for each set
		for (let i = 0; i < utf32Set.length; i++) {
			const item = utf32Set[i];
			const firstRegex = createUTF16EmojiRegexItem(item.first);
			const secondRegex = item.second;

			// Generate regex, add numbers list for reference
			results.push(
				createSequenceEmojiRegexItem(
					[firstRegex, secondRegex],
					item.numbers
				)
			);
		}
	}

	return results.length === 1 ? results[0] : createSetEmojiRegexItem(results);
}

/**
 * Create sequence of numbers
 */
export function createRegexForNumbersSequence(
	numbers: number[],
	optionalVariations = true
): SequenceEmojiItemRegex | UTF16EmojiItemRegex | OptionalEmojiItemRegex {
	const items: (UTF16EmojiItemRegex | OptionalEmojiItemRegex)[] = [];
	for (let i = 0; i < numbers.length; i++) {
		const num = numbers[i];
		const split = splitUTF32Number(num);
		if (!split) {
			// UTF-16 number
			const item = createUTF16EmojiRegexItem([num]);
			if (optionalVariations && num === vs16Emoji) {
				items.push(createOptionalEmojiRegexItem(item));
			} else {
				items.push(item);
			}
		} else {
			// UTF-32 number
			items.push(createUTF16EmojiRegexItem([split[0]]));
			items.push(createUTF16EmojiRegexItem([split[1]]));
		}
	}

	if (items.length === 1) {
		// Only 1 item
		return items[0];
	}

	const result = createSequenceEmojiRegexItem(items);
	if (numbers.length === 1 && items[0].type === 'utf16') {
		// Copy numbers if utf-16 or utf-32 sequence
		result.numbers = [...numbers];
	}
	return result;
}

/**
 * Attempt to optimise numbers in a set
 */
export function optimiseNumbersSet(set: SetEmojiItemRegex): EmojiItemRegex {
	interface Match {
		numbers: number[];
		items: EmojiItemRegex[];
	}
	const mandatoryMatches: Match = {
		numbers: [],
		items: [],
	};
	const optionalMatches: Match = {
		numbers: [],
		items: [],
	};

	const filteredItems: EmojiItemRegex[] = set.sets.filter((item) => {
		if (item.type === 'optional') {
			const parentItem = item.item;
			if (parentItem.numbers) {
				optionalMatches.items.push(item);
				optionalMatches.numbers = optionalMatches.numbers.concat(
					parentItem.numbers
				);
				return false;
			}
			return true;
		}

		if (item.numbers) {
			mandatoryMatches.items.push(item);
			mandatoryMatches.numbers = mandatoryMatches.numbers.concat(
				item.numbers
			);
			return false;
		}
		return true;
	});

	// Check if there is something to optimise
	if (mandatoryMatches.items.length + optionalMatches.items.length < 2) {
		return set;
	}

	// Remove duplicate numbers
	const optionalNumbers = new Set(optionalMatches.numbers);
	let foundMatches = false;
	mandatoryMatches.numbers = mandatoryMatches.numbers.filter((number) => {
		if (optionalNumbers.has(number)) {
			foundMatches = true;
			return false;
		}
		return true;
	});

	// Check mandatory numbers
	if (mandatoryMatches.items.length) {
		if (!foundMatches && mandatoryMatches.items.length === 1) {
			// 1 unchanged item
			filteredItems.push(mandatoryMatches.items[0]);
		} else if (mandatoryMatches.numbers.length) {
			// Merge items
			filteredItems.push(
				createEmojiRegexItemForNumbers(mandatoryMatches.numbers)
			);
		}
	}

	// Check optional numbers
	switch (optionalMatches.items.length) {
		case 0:
			break;

		case 1:
			filteredItems.push(optionalMatches.items[0]);
			break;

		default:
			filteredItems.push(
				createOptionalEmojiRegexItem(
					createEmojiRegexItemForNumbers(optionalMatches.numbers)
				)
			);
	}

	// Return regex
	return filteredItems.length === 1
		? filteredItems[0]
		: createSetEmojiRegexItem(filteredItems);
}
