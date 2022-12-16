import { emojiComponents, EmojiComponentType, vs16Emoji } from '../data';
import { getEmojiSequenceString } from '../format';
import {
	EmojiTestDataComponentsMap,
	mapEmojiTestDataComponents,
} from './components';
import { EmojiTestDataItem, mapEmojiTestDataBySequence } from './parse';

interface EmojiNameVariation {
	// Index in sequence
	index: number;

	// Component type
	type: EmojiComponentType;
}

export interface SplitEmojiName {
	// Base name
	base: string;

	// Unique key, based on base name and non-component variations
	key: string;

	// Variations
	variations?: (string | EmojiNameVariation)[];

	// Number of components
	components?: number;
}

const nameSplit = ': ';
const variationSplit = ', ';

// Variations to ignore when creating a unique key
const ignoredVariations = new Set(['person']);

/**
 * Split emoji name to base name and variations
 *
 * Also finds indexes of each variation
 */
export function splitEmojiNameVariations(
	name: string,
	sequence: number[],
	componentsData: EmojiTestDataComponentsMap
): SplitEmojiName {
	const parts = name.split(nameSplit);
	const base = parts.shift() as string;
	if (!parts.length) {
		// No variations
		return {
			base,
			key: base,
		};
	}

	// Get variations
	let startIndex = 0;
	let components = 0;
	const keyParts: string[] = [];
	const variations = parts
		.join(nameSplit)
		.split(variationSplit)
		.map((text) => {
			const type = componentsData.types[text];
			if (!type) {
				// Not a component
				if (!ignoredVariations.has(text)) {
					keyParts.push(text);
				}
				return text;
			}

			// Component
			const range = emojiComponents[type];
			while (startIndex < sequence.length) {
				const num = sequence[startIndex];
				startIndex++;
				if (num >= range[0] && num <= range[1]) {
					// Got range match
					components++;
					return {
						index: startIndex - 1,
						type,
					};
				}
			}

			// Ran out of sequence
			throw new Error(
				`Cannot find variation in sequence for "${name}", [${sequence.join(
					' '
				)}]`
			);
		});

	const key =
		base +
		(keyParts.length ? nameSplit + keyParts.join(variationSplit) : '');

	return {
		base,
		key,
		variations,
		components,
	};
}

/**
 * Merge component types
 */
function mergeComponentTypes(value: EmojiComponentType[]) {
	return '[' + value.join(',') + ']';
}

type ComponentsCount = Required<Record<EmojiComponentType, number>>;

function mergeComponentsCount(value: ComponentsCount) {
	const keys: EmojiComponentType[] = [];
	for (const key in emojiComponents) {
		const type = key as EmojiComponentType;
		for (let i = 0; i < value[type]; i++) {
			keys.push(type);
		}
	}
	return keys.length ? mergeComponentTypes(keys) : '';
}

/**
 * Map item
 */
type EmojiComponentsMapItemSequence = (EmojiComponentType | number)[];
export interface EmojiComponentsMapItem {
	// Name, with `{skin-tone-1}` (type + index) placeholders
	name: string;

	// Sequence
	sequence: EmojiComponentsMapItemSequence;

	// Child element(s)
	children?: Record<EmojiComponentType, EmojiComponentsMapItem>;
}

/**
 * Get map of emoji components
 *
 * Result includes emoji sequences with largest number of characters (usually fully-qualified)
 * Only sequences with components are returned
 */
export function getEmojiComponentsMap(
	testData: EmojiTestDataItem[],
	componentsMap?: EmojiTestDataComponentsMap
): EmojiComponentsMapItem[] {
	// Prepare stuff
	const components =
		componentsMap ||
		mapEmojiTestDataComponents(
			mapEmojiTestDataBySequence(testData, getEmojiSequenceString),
			getEmojiSequenceString
		);

	// Function to clean sequence
	const cleanSequence = (sequence: number[]): string => {
		return getEmojiSequenceString(
			sequence.filter(
				(num) => num !== vs16Emoji && !components.converted.has(num)
			)
		);
	};

	// Map all items
	interface SplitListItem {
		item: EmojiTestDataItem;
		split: SplitEmojiName;
		components: ComponentsCount;
	}
	type SplitList = Record<string, SplitListItem>;
	const splitData = Object.create(null) as Record<string, SplitList>;
	const defaultSplitDataKey = 'default';

	testData.forEach((item) => {
		// Split it
		const split = splitEmojiNameVariations(
			item.name,
			item.sequence,
			components
		);
		const parent =
			splitData[split.key] ||
			(splitData[split.key] = Object.create(null) as SplitList);

		// Create unique key based on component types
		let sequenceKey = defaultSplitDataKey;
		const itemComponents: ComponentsCount = {
			'hair-style': 0,
			'skin-tone': 0,
		};
		if (split.components) {
			split.variations?.forEach((item) => {
				if (typeof item !== 'string') {
					itemComponents[item.type]++;
				}
			});
			sequenceKey =
				mergeComponentsCount(itemComponents) || defaultSplitDataKey;
		}

		// Get item if already exists
		const prevItem = parent[sequenceKey];
		if (!prevItem) {
			parent[sequenceKey] = {
				item,
				split,
				components: itemComponents,
			};
			return;
		}

		if (
			cleanSequence(prevItem.item.sequence) !==
			cleanSequence(item.sequence)
		) {
			// console.log(prevItem.item);
			// console.log(item);
			throw new Error(`Mismatched items with same key: ${sequenceKey}`);
		}

		if (item.sequence.length > prevItem.item.sequence.length) {
			// Keep longer sequence
			parent[sequenceKey] = {
				item,
				split,
				components: itemComponents,
			};
		}
	});

	// Parse all items
	const results: EmojiComponentsMapItem[] = [];
	for (const key in splitData) {
		const items = splitData[key];

		// Function to get item
		const getItem = (
			components: ComponentsCount
		): EmojiComponentsMapItem | undefined => {
			const key = mergeComponentsCount(components) || defaultSplitDataKey;
			const item = items[key];
			if (!item) {
				return;
			}

			const split = item.split;
			const variations = split.variations;

			// Get sequence
			const sequence = item.item.sequence.slice(
				0
			) as EmojiComponentsMapItemSequence;
			variations?.forEach((chunk) => {
				if (typeof chunk === 'string') {
					return;
				}
				sequence[chunk.index] = chunk.type;
			});

			// Get name
			const counter: ComponentsCount = {
				'hair-style': 0,
				'skin-tone': 0,
			};
			const nameVariations = variations?.map((chunk) => {
				if (typeof chunk === 'string') {
					return chunk;
				}
				const count = counter[chunk.type]++;
				if (components[chunk.type] < count) {
					throw new Error('Bad variations order');
				}
				return `{${chunk.type}-${count}}`;
			});
			const name =
				split.base +
				(nameVariations?.length
					? nameSplit + nameVariations.join(variationSplit)
					: '');

			return {
				name,
				sequence,
			};
		};

		const checkChildren = (
			parent: EmojiComponentsMapItem,
			components: ComponentsCount
		): boolean => {
			// Attempt to add each type
			let found = false;
			for (const key in emojiComponents) {
				const type = key as EmojiComponentType;

				// Find child item
				const childComponents = {
					...components,
				};
				childComponents[type]++;
				const childItem = getItem(childComponents);

				// Get sequence for child item
				if (childItem) {
					found = true;

					// Add child item, check its children
					const children =
						parent.children ||
						(parent.children = {} as Record<
							EmojiComponentType,
							EmojiComponentsMapItem
						>);
					children[type] = childItem;
					checkChildren(childItem, childComponents);
				}
			}
			return found;
		};

		// Get main item
		const mainItem = getItem({
			'hair-style': 0,
			'skin-tone': 0,
		});
		if (mainItem) {
			if (
				checkChildren(mainItem, {
					'hair-style': 0,
					'skin-tone': 0,
				})
			) {
				// Found item with children
				results.push(mainItem);
			}
		}
	}

	return results;
}
