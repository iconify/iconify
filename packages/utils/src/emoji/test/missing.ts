import { getUnqualifiedEmojiSequence } from '../cleanup';
import { emojiComponents, EmojiComponentType } from '../data';
import { getEmojiSequenceKeyword } from '../format';
import {
	replaceEmojiComponentsInCombinedSequence,
	EmojiSequenceComponentValues,
} from './components';
import type { EmojiComponentsTree, EmojiComponentsTreeItem } from './tree';

/**
 * Base type to extend
 */
interface BaseSequenceItem {
	sequence: number[];

	// If present, will be set in value too
	// String version of sequence without variation unicode
	sequenceKey?: string;
}

/**
 * Find missing emojis
 *
 * Result includes missing items, which are extended from items that needs to
 * be copied. To identify which emojis to copy, source object should include
 * something like `iconName` key that points to icon sequence represents.
 */
export function findMissingEmojis<T extends BaseSequenceItem>(
	sequences: T[],
	testDataTree: EmojiComponentsTree
): T[] {
	const results: T[] = [];

	const existingItems = Object.create(null) as Record<string, T>;
	const copiedItems = Object.create(null) as Record<string, T>;

	// Get all existing sequences
	sequences.forEach((item) => {
		const sequence = getUnqualifiedEmojiSequence(item.sequence);
		const key = getEmojiSequenceKeyword(sequence);
		if (
			!existingItems[key] ||
			// If multiple matches for same sequence exist, use longest version
			existingItems[key].sequence.length < item.sequence.length
		) {
			existingItems[key] = item;
		}
	});

	// Function to iterate sequences
	const iterate = (
		type: EmojiComponentType,
		parentTree: EmojiComponentsTreeItem,
		parentValues: Required<EmojiSequenceComponentValues>,
		parentItem: T,
		deep: boolean
	) => {
		const childTree = parentTree.children?.[type];
		if (!childTree) {
			return;
		}

		// Sequence exists
		const range = emojiComponents[type];
		for (let number = range[0]; number < range[1]; number++) {
			// Create new values
			const values: Required<EmojiSequenceComponentValues> = {
				'hair-style': [...parentValues['hair-style']],
				'skin-tone': [...parentValues['skin-tone']],
			};
			values[type].push(number);

			// Generate sequence
			const sequence = replaceEmojiComponentsInCombinedSequence(
				childTree.item.sequence,
				values
			);
			const key = getEmojiSequenceKeyword(
				getUnqualifiedEmojiSequence(sequence)
			);

			// Get item
			const oldItem = existingItems[key];
			let item: T;
			if (oldItem) {
				// Exists
				item = oldItem;
			} else {
				// Check if already created
				item = copiedItems[key];
				if (!item) {
					// Create new item
					item = {
						...parentItem,
						sequence,
					};
					if (item.sequenceKey) {
						item.sequenceKey = key;
					}
					copiedItems[key] = item;
					results.push(item);
				}
			}

			// Check child elements
			if (deep || oldItem) {
				for (const key in values) {
					iterate(
						key as EmojiComponentType,
						childTree,
						values,
						item,
						deep
					);
				}
			}
		}
	};

	// Function to check tree item
	const parse = (key: string, deep: boolean) => {
		const treeItem = testDataTree[key];
		const sequenceKey = treeItem.item.sequenceKey;

		// Check if item actually exists
		const rootItem = existingItems[sequenceKey];
		if (!rootItem) {
			return;
		}

		// Parse tree
		const values: Required<EmojiSequenceComponentValues> = {
			'skin-tone': [],
			'hair-style': [],
		};
		for (const key in values) {
			iterate(
				key as EmojiComponentType,
				treeItem,
				values,
				rootItem,
				deep
			);
		}
	};

	// Shallow check first, then full check
	for (const key in testDataTree) {
		parse(key, false);
		parse(key, true);
	}

	return results;
}
