import {
	cloneEmojiRegexItem,
	createOptionalEmojiRegexItem,
	createSequenceEmojiRegexItem,
	createSetEmojiRegexItem,
	EmojiItemRegex,
	SetEmojiItemRegex,
} from './base';
import { optimiseNumbersSet } from './numbers';

type SlicePosition = 'start' | 'end';
type SliceValue = number | 'full';

/**
 * Slice of sequence
 */
interface SimilarRegexItemSlice {
	// Index of item in sequences list
	index: number;

	// Start (for 'end' slices) or end (for 'start' slices) of slice
	// 'full' if nothing to slice
	slice: SliceValue;
}

/**
 * Similar sequence
 */
interface SimilarRegexItemSequence {
	// Where common part is found
	// Common chunks can exist only at start or end of sequence, not in middle
	type: SlicePosition;

	// Slices. Key is index in items list, value is start (for 'end' slices)
	// or end (for 'start' slices) of slice, 'full' for full items
	slices: SimilarRegexItemSlice[];
}

/**
 * Result if findSimilarRegexItemSequences()
 */
interface SimilarRegexItemSequenceResult {
	// Replacement score: how many characters will be saved by merging items
	score: number;

	// Sequences that match it
	sequences: SimilarRegexItemSequence[];
}

/**
 * Typescript stuff
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(v: never) {
	// Empty function that should never be called
}

/**
 * Find similar item sequences
 *
 * Returns sequence(s) with highest score. Only one of results should be
 * applied to items. If there are multiple sequences, clone items list,
 * attempt to apply each sequence, run further optimisations on each fork
 * and see which one returns better result.
 *
 * Returns undefined if no common sequences found
 */
export function findSimilarRegexItemSequences(
	items: EmojiItemRegex[]
): SimilarRegexItemSequenceResult | undefined {
	interface MapItem {
		score: number;
		slices: SimilarRegexItemSlice[];
	}

	// Regex at start and end of sequences
	// Key = regex combination
	const startRegex = Object.create(null) as Record<string, MapItem>;
	const endRegex = Object.create(null) as Record<string, MapItem>;

	const addMapItem = (
		target: Record<string, MapItem>,
		index: number,
		regex: string,
		slice: SliceValue
	) => {
		if (!target[regex]) {
			// New item
			target[regex] = {
				// Start with 0. One item will remain after replacement
				score: 0,
				slices: [
					{
						index,
						slice,
					},
				],
			};
			return;
		}

		// Existing item
		const item = target[regex];
		item.score += regex.length;
		item.slices.push({
			index,
			slice,
		});
	};

	// Create list of all possible sequences
	for (let index = 0; index < items.length; index++) {
		const baseItem = items[index];
		switch (baseItem.type) {
			case 'optional':
			case 'utf16': {
				// Nothing to split
				addMapItem(startRegex, index, baseItem.regex, 'full');
				addMapItem(endRegex, index, baseItem.regex, 'full');
				break;
			}

			case 'sequence': {
				// Add as full item
				addMapItem(startRegex, index, baseItem.regex, 'full');
				addMapItem(endRegex, index, baseItem.regex, 'full');

				// Add chunks
				const sequence = baseItem.items;
				for (let i = 1; i < sequence.length; i++) {
					const startSequence = createSequenceEmojiRegexItem(
						sequence.slice(0, i)
					);
					addMapItem(startRegex, index, startSequence.regex, i);

					const endSequence = createSequenceEmojiRegexItem(
						sequence.slice(i)
					);
					addMapItem(endRegex, index, endSequence.regex, i);
				}

				break;
			}

			case 'set':
				throw new Error('Unexpected set within a set');

			default:
				assertNever(baseItem);
		}
	}

	// Create list of usable matches
	let result: SimilarRegexItemSequenceResult | undefined;

	const checkResults = (
		target: Record<string, MapItem>,
		type: SlicePosition
	) => {
		for (const regex in target) {
			const item = target[regex];
			if (!item.score) {
				continue;
			}
			if (!result || result.score < item.score) {
				// New highest score
				result = {
					score: item.score,
					sequences: [
						{
							type,
							slices: item.slices,
						},
					],
				};
				continue;
			}
			if (result.score === item.score) {
				// Same score
				result.sequences.push({
					type,
					slices: item.slices,
				});
			}
		}
	};
	checkResults(startRegex, 'start');
	checkResults(endRegex, 'end');
	return result;
}

/**
 * Merge similar sequences
 *
 * Accepts callback to run optimisation on created subset
 */
export function mergeSimilarRegexItemSequences(
	items: EmojiItemRegex[],
	merge: SimilarRegexItemSequence,
	optimise?: (set: SetEmojiItemRegex) => EmojiItemRegex
): EmojiItemRegex[] {
	const { type, slices } = merge;

	// Get common chunks
	const indexes: Set<number> = new Set();
	let hasFullSequence = false;
	let longestMatch = 0;
	let longestMatchIndex = -1;
	const differentSequences: EmojiItemRegex[][] = [];

	for (let i = 0; i < slices.length; i++) {
		const { index, slice } = slices[i];
		const item = items[index];

		let length: number;
		if (slice === 'full') {
			// Full match
			hasFullSequence = true;
			if (item.type === 'sequence') {
				length = item.items.length;
			} else {
				length = 1;
			}
		} else {
			if (item.type !== 'sequence') {
				throw new Error(
					`Unexpected partial match for type "${item.type}"`
				);
			}
			length = type === 'start' ? slice : item.items.length - slice;

			// Copy remaining chunks
			differentSequences.push(
				type === 'start'
					? item.items.slice(slice)
					: item.items.slice(0, slice)
			);
		}

		if (length > longestMatch) {
			longestMatchIndex = index;
			longestMatch = length;
		}

		indexes.add(index);
	}

	// Found common chunk
	if (longestMatch < 1 || longestMatchIndex < 0) {
		throw new Error('Cannot find common sequence');
	}

	// Get longest common item as sequence
	const commonItem = items[longestMatchIndex];
	let sequence: EmojiItemRegex[];
	if (commonItem.type !== 'sequence') {
		// Full match
		if (longestMatch !== 1) {
			throw new Error(
				'Something went wrong. Cannot have long match in non-sequence'
			);
		}
		sequence = [commonItem];
	} else {
		// Sequence
		sequence =
			type === 'start'
				? commonItem.items.slice(0, longestMatch)
				: commonItem.items.slice(
						commonItem.items.length - longestMatch
				  );
	}

	// Merge other chunks
	const setItems: EmojiItemRegex[] = [];
	for (let i = 0; i < differentSequences.length; i++) {
		const list = differentSequences[i];
		if (list.length === 1) {
			// 1 item
			setItems.push(list[0]);
		} else {
			// create sequence
			setItems.push(createSequenceEmojiRegexItem(list));
		}
	}

	// Create set, optimise is, make it optional
	const set = createSetEmojiRegexItem(setItems);
	let mergedChunk: EmojiItemRegex =
		set.sets.length === 1
			? // Do not run callback if only 1 item
			  set.sets[0]
			: optimise
			? // Run callback to optimise it
			  optimise(set)
			: // Use set as is
			  set;
	if (hasFullSequence) {
		// Wrap in optional
		mergedChunk = createOptionalEmojiRegexItem(mergedChunk);
	}

	// Add set to sequence
	sequence[type === 'start' ? 'push' : 'unshift'](mergedChunk);

	// Create result by combining merged item and remaining items
	const results: EmojiItemRegex[] = [
		createSequenceEmojiRegexItem(sequence),
		...items.filter((item, index) => !indexes.has(index)),
	];
	return results;
}

/**
 * Merge similar items
 */
export function mergeSimilarItemsInSet(set: SetEmojiItemRegex): EmojiItemRegex {
	// Check for numbers
	const updatedSet = optimiseNumbersSet(set);
	if (updatedSet.type !== 'set') {
		return updatedSet;
	}
	set = updatedSet;

	// Attempt to find common stuff
	let merges: SimilarRegexItemSequenceResult | undefined;
	while ((merges = findSimilarRegexItemSequences(set.sets))) {
		const sequences = merges.sequences;
		if (sequences.length === 1) {
			// Only 1 sequence
			const merged = mergeSimilarRegexItemSequences(
				set.sets.map((item) => cloneEmojiRegexItem(item, true)),
				sequences[0],
				mergeSimilarItemsInSet
			);
			if (merged.length === 1) {
				// No longer a set
				return merged[0];
			}

			// New set
			set = createSetEmojiRegexItem(merged);
			continue;
		}

		// Multiple merges
		let newItem: EmojiItemRegex | undefined;
		for (let i = 0; i < sequences.length; i++) {
			const merged = mergeSimilarRegexItemSequences(
				set.sets.map((item) => cloneEmojiRegexItem(item, true)),
				sequences[i],
				mergeSimilarItemsInSet
			);

			const mergedItem =
				merged.length === 1
					? merged[0]
					: createSetEmojiRegexItem(merged);
			if (!newItem || mergedItem.regex.length < newItem.regex.length) {
				newItem = mergedItem;
			}
		}
		if (!newItem) {
			throw new Error('Empty sequences list');
		}
		if (newItem.type !== 'set') {
			return newItem;
		}
		set = newItem;
	}

	return set;
}
