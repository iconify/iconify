import {
	createOptionalEmojiRegexItem,
	createSequenceEmojiRegexItem,
	createSetEmojiRegexItem,
	createUTF16EmojiRegexItem,
	EmojiItemRegex,
} from './base';
import { splitEmojiSequences } from '../cleanup';
import { convertEmojiSequenceToUTF32 } from '../convert';
import { createRegexForNumbersSequence } from './numbers';
import { joinerEmoji } from '../data';
import { mergeSimilarItemsInSet } from './similar';

/**
 * Tree item
 */
interface TreeItem {
	// Regex
	regex: EmojiItemRegex;

	// True if end of sequence. If children are set, it means children are optional
	end?: true;

	// Child elements, separated with 0x200d
	children?: TreeItem[];
}

/**
 * Create tree
 */
export function createEmojisTree(sequences: number[][]): TreeItem[] {
	const root: TreeItem[] = [];

	for (let i = 0; i < sequences.length; i++) {
		// Convert to UTF-32 and split
		const split = splitEmojiSequences(
			convertEmojiSequenceToUTF32(sequences[i])
		);

		// Get items
		let parent = root;
		for (let j = 0; j < split.length; j++) {
			const regex = createRegexForNumbersSequence(split[j]);

			// Find item
			let item: TreeItem;
			const match = parent.find(
				(item) => item.regex.regex === regex.regex
			);
			if (!match) {
				// Create new item
				item = {
					regex,
				};
				parent.push(item);
			} else {
				item = match;
			}

			// End?
			if (j === split.length - 1) {
				item.end = true;
				break;
			}

			// Parse children
			parent = item.children || (item.children = []);
		}
	}

	return root;
}

/**
 * Parse tree
 */
export function parseEmojiTree(items: TreeItem[]): EmojiItemRegex {
	interface ParsedTreeItem {
		// Regex
		regex: EmojiItemRegex;

		// True if end of sequence. If children are set, it means children are optional
		end: boolean;

		// Regex for merged child elements
		children?: EmojiItemRegex;
	}

	function mergeParsedChildren(items: ParsedTreeItem[]): EmojiItemRegex {
		const parsedItems: EmojiItemRegex[] = [];

		// Find items with same 'end' and 'children'
		type TreeItemsMap = Record<string, Required<ParsedTreeItem>[]>;
		const mapWithoutEnd = Object.create(null) as TreeItemsMap;
		const mapWithEnd = Object.create(null) as TreeItemsMap;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const children = item.children;
			if (children) {
				const fullItem = item as Required<ParsedTreeItem>;
				const target = item.end ? mapWithEnd : mapWithoutEnd;
				const regex = children.regex;
				if (!target[regex]) {
					target[regex] = [fullItem];
				} else {
					target[regex].push(fullItem);
				}
			} else {
				// Nothing to parse
				parsedItems.push(item.regex);
			}
		}

		// Parse all sets
		[mapWithEnd, mapWithoutEnd].forEach((source) => {
			for (const regex in source) {
				const items = source[regex];
				const firstItem = items[0];

				// Merge common chunk + joiner
				let childSequence: EmojiItemRegex[] = [
					createUTF16EmojiRegexItem([joinerEmoji]),
					firstItem.children,
				];
				if (firstItem.end) {
					// Make it optional
					childSequence = [
						createOptionalEmojiRegexItem(
							createSequenceEmojiRegexItem(childSequence)
						),
					];
				}

				// Get remaining chunk
				let mergedRegex: EmojiItemRegex;
				if (items.length === 1) {
					// No matches
					mergedRegex = firstItem.regex;
				} else {
					// Merge items
					mergedRegex = mergeSimilarItemsInSet(
						createSetEmojiRegexItem(items.map((item) => item.regex))
					);
				}

				// Merge
				const sequence = createSequenceEmojiRegexItem([
					mergedRegex,
					...childSequence,
				]);
				parsedItems.push(sequence);
			}
		});

		// Merge sequences
		if (parsedItems.length === 1) {
			return parsedItems[0];
		}
		const set = createSetEmojiRegexItem(parsedItems);
		const result = mergeSimilarItemsInSet(set);
		return result;
	}

	function parseItemChildren(item: TreeItem): ParsedTreeItem {
		const result: ParsedTreeItem = {
			regex: item.regex,
			end: !!item.end,
		};

		// Parse child elements
		const children = item.children;
		if (!children) {
			return result;
		}

		const parsedChildren = children.map(parseItemChildren);
		result.children = mergeParsedChildren(parsedChildren);
		return result;
	}

	// Parse all items
	const parsed = items.map(parseItemChildren);
	return mergeParsedChildren(parsed);
}
