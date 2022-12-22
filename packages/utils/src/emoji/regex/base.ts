/**
 * Regex in item
 */
interface BaseEmojiItemRegex {
	// Regex type:
	// 'utf16' -> utf16 number(s)
	// 'sequence' -> sequence, not wrapped in `(?:` + `)`
	//		requires wrapping, unless marked as wrapped
	// 'options' -> list of options, not wrapped in `(?:` + `)`
	//		requires wrapping
	type: 'utf16' | 'sequence' | 'set' | 'optional';

	// Regex
	regex: string;

	// True if regex can be treated as a group (does not require wrapping in `(?:` + `)`)
	group: boolean;

	// Number of characters, minimum value
	length: number;
}

interface EmojiItemRegexWithNumbers {
	// Numbers in regex, set if regex represents set of numbers. Allows
	// creation of number ranges when combining multiple regex items
	// Cannot be empty array
	numbers?: number[];
}

// Numbers
export interface UTF16EmojiItemRegex
	extends BaseEmojiItemRegex,
		Required<EmojiItemRegexWithNumbers> {
	type: 'utf16';

	// Always grouped
	group: true;

	// `numbers` is required
}

// Sequence
type SequenceEmojiItemRegexItem =
	| UTF16EmojiItemRegex
	| SetEmojiItemRegex
	| OptionalEmojiItemRegex;
export interface SequenceEmojiItemRegex
	extends BaseEmojiItemRegex,
		EmojiItemRegexWithNumbers {
	type: 'sequence';

	// Items in sequence. Any type except another sequence
	items: SequenceEmojiItemRegexItem[];
}

// Set
export type SetEmojiItemRegexItem =
	| UTF16EmojiItemRegex
	| SequenceEmojiItemRegex
	| OptionalEmojiItemRegex;
export interface SetEmojiItemRegex
	extends BaseEmojiItemRegex,
		EmojiItemRegexWithNumbers {
	type: 'set';

	// Items in set. Any type except another set
	sets: SetEmojiItemRegexItem[];
}

// Optional
type OptionalEmojiItemRegexItem =
	| UTF16EmojiItemRegex
	| SequenceEmojiItemRegex
	| SetEmojiItemRegex;
export interface OptionalEmojiItemRegex extends BaseEmojiItemRegex {
	type: 'optional';

	// Wrapped item. Any type except another optional item
	item: OptionalEmojiItemRegexItem;

	// Always grouped
	group: true;
}

export type EmojiItemRegex =
	| UTF16EmojiItemRegex
	| SequenceEmojiItemRegex
	| SetEmojiItemRegex
	| OptionalEmojiItemRegex;

/**
 * Convert number to string
 */
function toString(number: number): string {
	if (number < 255) {
		// Hex or character
		if (number > 32 && number < 127) {
			// Character
			const char = String.fromCharCode(number);
			if (
				// 0-9
				(number > 47 && number < 58) ||
				// A-Z
				(number > 64 && number < 91) ||
				// _`a-z
				(number > 94 && number < 123)
			) {
				return char;
			}
			return '\\' + char;
		}
		return (
			'\\x' + (number < 16 ? '0' : '') + number.toString(16).toUpperCase()
		);
	}

	// Unicode
	return '\\u' + number.toString(16).toUpperCase();
}

/**
 * Typescript stuff
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(v: never) {
	// Empty function that should never be called
}

/**
 * Wrap regex in group
 */
export function wrapRegexInGroup(regex: string): string {
	return '(?:' + regex + ')';
}

/**
 * Update UTF16 item, return regex
 */
export function updateUTF16EmojiRegexItem(item: UTF16EmojiItemRegex): string {
	const numbers = item.numbers;
	if (numbers.length === 1) {
		// 1 number
		const num = numbers[0];
		return (item.regex = toString(num));
	}

	// Multiple numbers
	numbers.sort((a, b) => a - b);
	const chars: string[] = [];
	interface Range {
		start: number;
		last: number;
		numbers: number[];
	}
	let range: Range | null = null;
	const addRange = () => {
		if (range) {
			const { start, last, numbers } = range;
			range = null;
			if (last > start + 1) {
				// More than 2 items
				chars.push(toString(start) + '-' + toString(last));
			} else {
				for (let i = 0; i < numbers.length; i++) {
					chars.push(toString(numbers[i]));
				}
			}
		}
	};

	for (let i = 0; i < numbers.length; i++) {
		const num = numbers[i];
		if (range) {
			if (range.last === num) {
				// Duplicate
				continue;
			}
			if (range.last === num - 1) {
				// Add to existing range
				range.numbers.push(num);
				range.last = num;
				continue;
			}
		}

		// Not in range: start new one
		addRange();
		range = {
			start: num,
			last: num,
			numbers: [num],
		};
	}
	addRange();

	if (!chars.length) {
		throw new Error('Unexpected empty range');
	}
	return (item.regex = '[' + chars.join('') + ']');
}

/**
 * Create UTF-16 regex
 */
export function createUTF16EmojiRegexItem(
	numbers: number[]
): UTF16EmojiItemRegex {
	const result: UTF16EmojiItemRegex = {
		type: 'utf16',
		regex: '',
		numbers,
		length: 1,
		group: true,
	};
	updateUTF16EmojiRegexItem(result);
	return result;
}

/**
 * Update sequence regex. Does not update group
 */
export function updateSequenceEmojiRegexItem(
	item: SequenceEmojiItemRegex
): string {
	return (item.regex = item.items
		.map((childItem) => {
			if (!childItem.group && childItem.type === 'set') {
				return wrapRegexInGroup(childItem.regex);
			}
			return childItem.regex;
		})
		.join(''));
}

/**
 * Create sequence regex
 */
export function createSequenceEmojiRegexItem(
	sequence: EmojiItemRegex[],
	numbers?: number[]
): SequenceEmojiItemRegex {
	// Merge items
	let items: SequenceEmojiItemRegexItem[] = [];
	sequence.forEach((item) => {
		if (item.type === 'sequence') {
			items = items.concat(item.items);
		} else {
			items.push(item);
		}
	});

	// Generate item
	if (!items.length) {
		throw new Error('Empty sequence');
	}
	const result: SequenceEmojiItemRegex = {
		type: 'sequence',
		items,
		regex: '',
		length: items.reduce((length, item) => item.length + length, 0),
		group: false,
	};

	if (sequence.length === 1) {
		const firstItem = sequence[0];
		result.group = firstItem.group;
		if (firstItem.type !== 'optional') {
			const numbers = firstItem.numbers;
			if (numbers) {
				result.numbers = numbers;
			}
		}
	}

	if (numbers) {
		result.numbers = numbers;
	}

	// Update regex
	updateSequenceEmojiRegexItem(result);
	return result;
}

/**
 * Update set regex and group
 */
export function updateSetEmojiRegexItem(item: SetEmojiItemRegex): string {
	if (item.sets.length === 1) {
		// 1 item
		const firstItem = item.sets[0];
		item.group = firstItem.group;
		return (item.regex = firstItem.regex);
	}

	// Multiple items
	item.group = false;
	return (item.regex = item.sets
		.map((childItem) => childItem.regex)
		.join('|'));
}

/**
 * Create set regex
 */
export function createSetEmojiRegexItem(
	set: EmojiItemRegex[]
): SetEmojiItemRegex {
	let sets: SetEmojiItemRegexItem[] = [];
	let numbers: number[] | null = [];

	set.forEach((item) => {
		if (item.type === 'set') {
			sets = sets.concat(item.sets);
		} else {
			sets.push(item);
		}

		// Copy numbers
		if (numbers) {
			if (item.type === 'optional' || !item.numbers) {
				numbers = null;
			} else {
				numbers = [...numbers, ...item.numbers];
			}
		}
	});

	// Sort items to guarantee same results regardless of order
	sets.sort((a, b) => {
		if (a.length === b.length) {
			return a.regex.localeCompare(b.regex);
		}
		return b.length - a.length;
	});

	// Create item
	const result: SetEmojiItemRegex = {
		type: 'set',
		sets,
		regex: '',
		length: sets.reduce(
			(length, item) =>
				length ? Math.min(length, item.length) : item.length,
			0
		),
		group: false,
	};
	if (numbers) {
		result.numbers = numbers;
	}

	if (set.length === 1) {
		const firstItem = set[0];
		result.group = firstItem.group;
	}

	updateSetEmojiRegexItem(result);
	return result;
}

/**
 * Update optional regex
 */
export function updateOptionalEmojiRegexItem(
	item: OptionalEmojiItemRegex
): string {
	const childItem = item.item;
	const regex =
		(childItem.group
			? childItem.regex
			: wrapRegexInGroup(childItem.regex)) + '?';
	return (item.regex = regex);
}

/**
 * Create optional item
 */
export function createOptionalEmojiRegexItem(
	item: EmojiItemRegex
): OptionalEmojiItemRegex {
	if (item.type === 'optional') {
		return item;
	}

	const result: OptionalEmojiItemRegex = {
		type: 'optional',
		item,
		regex: '',
		length: item.length,
		group: true,
	};
	updateOptionalEmojiRegexItem(result);
	return result;
}

/**
 * Clone item
 */
export function cloneEmojiRegexItem<T extends BaseEmojiItemRegex>(
	item: T,
	shallow = false
): T {
	const result = {
		...item,
	} as unknown as EmojiItemRegex;

	// Copy numbers
	if (result.type !== 'optional' && result.numbers) {
		result.numbers = [...result.numbers];
	}

	// Clone lists
	switch (result.type) {
		case 'utf16':
			// Nothing to do
			break;

		case 'sequence':
			if (shallow) {
				result.items = [...result.items];
			} else {
				result.items = result.items.map((item) =>
					cloneEmojiRegexItem(item, false)
				);
			}
			break;

		case 'set':
			if (shallow) {
				result.sets = [...result.sets];
			} else {
				result.sets = result.sets.map((item) =>
					cloneEmojiRegexItem(item, false)
				);
			}
			break;

		case 'optional':
			if (!shallow) {
				result.item = cloneEmojiRegexItem(result.item, false);
			}
			break;

		default:
			assertNever(result);
	}

	return result as unknown as T;
}
