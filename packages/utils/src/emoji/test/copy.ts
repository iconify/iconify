import { getUnqualifiedEmojiSequence } from '../cleanup';
import { emojiComponents, EmojiComponentType } from '../data';
import { getEmojiSequenceString } from '../format';
import { mapEmojiTestDataComponents } from './components';
import { EmojiComponentsMapItem, getEmojiComponentsMap } from './name';
import { EmojiTestDataItem, mapEmojiTestDataBySequence } from './parse';

type SequenceType = 'qualified' | 'unqualified';
interface SequenceData {
	type: SequenceType;
	sequence: number[];
	key: string;
}
type Sequences = Record<SequenceType, SequenceData>;

type ComponentsIteration = Required<Record<EmojiComponentType, number[]>>;

/**
 * Get components iteration
 */
function addToComponentsIteration(
	components: ComponentsIteration,
	attr: EmojiComponentType,
	value: number
): ComponentsIteration {
	const result: ComponentsIteration = {
		'hair-style': components['hair-style'].slice(0),
		'skin-tone': components['skin-tone'].slice(0),
	};
	result[attr].push(value);
	return result;
}

/**
 * Replace components with number in sequence
 */
function addComponentsToSequence(
	sequence: (EmojiComponentType | number)[],
	components: ComponentsIteration
): number[] {
	const indexes: Required<Record<EmojiComponentType, number>> = {
		'hair-style': 0,
		'skin-tone': 0,
	};
	return sequence.map((value) => {
		if (typeof value === 'number') {
			return value;
		}
		const index = indexes[value]++;
		return components[value][index];
	});
}

/**
 * Get sequence variations
 */
function getSequence(sequence: number[]): Sequences {
	const qualified: SequenceData = {
		type: 'qualified',
		sequence,
		key: getEmojiSequenceString(sequence),
	};

	const unqualifiedSequence = getUnqualifiedEmojiSequence(sequence);
	const unqualified: SequenceData =
		unqualifiedSequence.length === sequence.length
			? {
					...qualified,
					type: 'unqualified',
			  }
			: {
					type: 'unqualified',
					sequence: unqualifiedSequence,
					key: getEmojiSequenceString(unqualifiedSequence),
			  };

	return {
		qualified,
		unqualified,
	};
}

/**
 * Item to copy
 */
interface EmojiSequenceToCopy {
	// Source: sequence and name
	source: number[];
	sourceName: string;

	// Target: sequence and name
	target: number[];
	targetName: string;
}

/**
 * Get sequences
 *
 * Returns map, where key is item to add, value is source
 */
export function getEmojisSequencesToCopy(
	sequences: number[][],
	testData: EmojiTestDataItem[]
): EmojiSequenceToCopy[] {
	const results: EmojiSequenceToCopy[] = [];

	// Prepare stuff
	const componentsMap = mapEmojiTestDataComponents(
		mapEmojiTestDataBySequence(testData, getEmojiSequenceString),
		getEmojiSequenceString
	);
	const componentsMapItems = getEmojiComponentsMap(testData, componentsMap);

	// Get all existing emojis
	const existingItems = Object.create(null) as Record<string, number[]>;
	const copiedItems = Object.create(null) as Record<string, number[]>;
	sequences.forEach((sequence) => {
		existingItems[getEmojiSequenceString(sequence)] = sequence;
	});

	// Check if item exists
	const itemExists = (sequence: Sequences): SequenceType | undefined => {
		return existingItems[sequence.qualified.key]
			? 'qualified'
			: existingItems[sequence.unqualified.key]
			? 'unqualified'
			: void 0;
	};
	const itemWasCopied = (sequence: Sequences): SequenceType | undefined => {
		return copiedItems[sequence.qualified.key]
			? 'qualified'
			: copiedItems[sequence.unqualified.key]
			? 'unqualified'
			: void 0;
	};

	// Copy item
	const addToCopy = (
		source: SequenceData,
		sourceName: string,
		target: SequenceData,
		targetName: string
	) => {
		copiedItems[target.key] = target.sequence;
		results.push({
			source: source.sequence,
			sourceName,
			target: target.sequence,
			targetName,
		});
	};

	// Get name
	const getName = (
		item: EmojiComponentsMapItem,
		components: ComponentsIteration
	) => {
		let name = item.name;
		for (const key in emojiComponents) {
			const type = key as EmojiComponentType;
			for (let i = 0; i < components[type].length; i++) {
				const num = components[type][i];
				const text = componentsMap.names.get(num) as string;
				name = name.replace(`{${type}-${i}}`, text);
			}
		}
		return name;
	};

	// Check item and its children
	const checkItem = (
		parentItem: EmojiComponentsMapItem,
		parentSequence: SequenceData,
		parentComponents: ComponentsIteration,
		onlyIfExists = true
	) => {
		const children = parentItem.children;
		if (!children) {
			return;
		}
		for (const key in emojiComponents) {
			const type = key as EmojiComponentType;
			if (children[type]) {
				// Check emojis
				const childItem = children[type];
				const range = emojiComponents[type];

				// Add each item in range
				for (let num = range[0]; num < range[1]; num++) {
					const components = addToComponentsIteration(
						parentComponents,
						type,
						num
					);
					const sequence = addComponentsToSequence(
						childItem.sequence,
						components
					);
					const sequences = getSequence(sequence);

					// Check if already exists
					const existingSequence = itemExists(sequences);
					if (existingSequence) {
						// Already exists
						checkItem(
							childItem,
							sequences[existingSequence],
							components,
							onlyIfExists
						);
						continue;
					}

					// Check if was copied
					let copiedSequence = itemWasCopied(sequences);
					if (copiedSequence && onlyIfExists) {
						// Cannot parse nested items yet
						continue;
					}

					// Copy
					if (!copiedSequence) {
						// Copy sequence
						copiedSequence = parentSequence.type;
						addToCopy(
							parentSequence,
							getName(parentItem, parentComponents),
							sequences[copiedSequence],
							getName(childItem, components)
						);
					}

					// Check child items
					checkItem(
						childItem,
						sequences[copiedSequence],
						components,
						onlyIfExists
					);
				}
			}
		}
	};

	// Check all items
	componentsMapItems.forEach((mainItem) => {
		const sequence = getSequence(mainItem.sequence as number[]);
		const type = itemExists(sequence);
		if (!type) {
			// Base emoji is missing: nothing to do
			return;
		}

		checkItem(
			mainItem,
			sequence[type],
			{
				'hair-style': [],
				'skin-tone': [],
			},
			true
		);
		checkItem(
			mainItem,
			sequence[type],
			{
				'hair-style': [],
				'skin-tone': [],
			},
			false
		);
	});

	return results;
}
