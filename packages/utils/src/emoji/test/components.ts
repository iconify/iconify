import { emojiComponents, EmojiComponentType } from '../data';
import { getEmojiSequenceKeyword } from '../format';
import type { EmojiTestData, EmojiTestDataItem } from './parse';

export interface EmojiTestDataComponentsMap {
	// Keywords
	converted: Map<number, string>;

	// Items, mapped by both keyword and number
	items: Map<string | number, EmojiTestDataItem>;

	// Name. Shortcut for items[key].name
	names: Map<string | number, string>;

	// Component type and keyword by name
	types: Record<string, EmojiComponentType>;
	keywords: Record<string, string>;
}

/**
 * Map components from test data
 */
export function mapEmojiTestDataComponents(
	testSequences: EmojiTestData
): EmojiTestDataComponentsMap {
	const results: EmojiTestDataComponentsMap = {
		converted: new Map(),
		items: new Map(),
		names: new Map(),
		types: {},
		keywords: {},
	};

	for (const key in emojiComponents) {
		const type = key as EmojiComponentType;
		const range = emojiComponents[type];
		for (let number = range[0]; number < range[1]; number++) {
			const keyword = getEmojiSequenceKeyword([number]);
			const item = testSequences[keyword];
			if (!item) {
				throw new Error(
					`Missing emoji component in test sequence: "${keyword}"`
				);
			}

			results.converted.set(number, keyword);
			results.items.set(number, item);
			results.items.set(keyword, item);

			const name = item.name;
			results.names.set(number, name);
			results.names.set(keyword, name);
			results.types[name] = type;
			results.keywords[name] = keyword;
		}
	}

	return results;
}

/**
 * Sequence with components
 */
export type EmojiSequenceWithComponents = (EmojiComponentType | number)[];

/**
 * Convert to string
 */
export function emojiSequenceWithComponentsToString(
	sequence: EmojiSequenceWithComponents
): string {
	return sequence
		.map((item) => (typeof item === 'number' ? item.toString(16) : item))
		.join('-');
}

/**
 * Entry in sequence
 */
export interface EmojiSequenceComponentEntry {
	// Index in sequence
	index: number;

	// Component type
	type: EmojiComponentType;
}

/**
 * Find variations in sequence
 */
export function findEmojiComponentsInSequence(
	sequence: number[]
): EmojiSequenceComponentEntry[] {
	const components: EmojiSequenceComponentEntry[] = [];

	for (let index = 0; index < sequence.length; index++) {
		const code = sequence[index];
		for (const key in emojiComponents) {
			const type = key as EmojiComponentType;
			const range = emojiComponents[type];
			if (code >= range[0] && code < range[1]) {
				components.push({
					index,
					type,
				});
				break;
			}
		}
	}

	return components;
}

/**
 * Component values
 */
export type EmojiSequenceComponentValues = Partial<
	Record<EmojiComponentType, number[]>
>;

/**
 * Replace components in sequence
 */
export function replaceEmojiComponentsInCombinedSequence(
	sequence: EmojiSequenceWithComponents,
	values: EmojiSequenceComponentValues
): number[] {
	const indexes: Record<EmojiComponentType, number> = {
		'hair-style': 0,
		'skin-tone': 0,
	};
	return sequence.map((item) => {
		if (typeof item === 'number') {
			return item;
		}
		const index = indexes[item]++;
		const list = values[item];
		if (!list || !list.length) {
			throw new Error(`Cannot replace ${item}: no valid values provided`);
		}
		return list[index >= list.length ? list.length - 1 : index];
	});
}
