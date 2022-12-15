import { emojiComponents, EmojiComponentType } from '../data';
import type { EmojiSequenceToStringCallback, EmojiTestDataItem } from './parse';

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
	testSequences: Record<string, EmojiTestDataItem>,
	convert: EmojiSequenceToStringCallback
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
		for (let number = range[0]; number <= range[1]; number++) {
			const keyword = convert([number]);
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
