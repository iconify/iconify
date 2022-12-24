import { vs16Emoji } from '../data';
import {
	EmojiSequenceWithComponents,
	emojiSequenceWithComponentsToString,
	EmojiTestDataComponentsMap,
	mapEmojiTestDataComponents,
} from './components';
import { SplitEmojiName, splitEmojiNameVariations } from './name';
import type {
	BaseEmojiTestDataItem,
	EmojiTestData,
	EmojiTestDataItem,
} from './parse';

/**
 * Similar test data items as one item
 */
export interface CombinedEmojiTestDataItem extends BaseEmojiTestDataItem {
	// Name, split
	name: SplitEmojiName;

	// Sequence without variations, but with '{skin-tone}'
	sequenceKey: string;

	// Sequence with components
	sequence: EmojiSequenceWithComponents;
}

export type SimilarEmojiTestData = Record<string, CombinedEmojiTestDataItem>;

/**
 * Find components in item, generate CombinedEmojiTestDataItem
 */
export function findComponentsInEmojiTestItem(
	item: EmojiTestDataItem,
	componentsData: EmojiTestDataComponentsMap
): CombinedEmojiTestDataItem {
	// Split name
	const name = splitEmojiNameVariations(
		item.name,
		item.sequence,
		componentsData
	);

	// Update sequence
	const sequence = [...item.sequence] as EmojiSequenceWithComponents;
	name.variations?.forEach((item) => {
		if (typeof item !== 'string') {
			sequence[item.index] = item.type;
		}
	});

	// Generate new key based on sequence
	const sequenceKey = emojiSequenceWithComponentsToString(
		sequence.filter((code) => code !== vs16Emoji)
	);

	return {
		...item,
		name,
		sequenceKey,
		sequence,
	};
}

/**
 * Combine similar items in one iteratable item
 */
export function combineSimilarEmojiTestData(
	data: EmojiTestData,
	componentsData?: EmojiTestDataComponentsMap
): SimilarEmojiTestData {
	const results = Object.create(null) as SimilarEmojiTestData;
	componentsData = componentsData || mapEmojiTestDataComponents(data);

	for (const key in data) {
		const sourceItem = data[key];
		if (sourceItem.status !== 'component') {
			const item = findComponentsInEmojiTestItem(
				sourceItem,
				componentsData
			);
			results[item.sequenceKey] = item;
		}
	}

	return results;
}
