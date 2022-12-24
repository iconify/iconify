import { emojiComponents, EmojiComponentType } from '../data';
import type {
	EmojiSequenceComponentEntry,
	EmojiTestDataComponentsMap,
} from './components';

/**
 * Split emoji name in base name and variations
 *
 * Variations are also split in strings and emoji components with indexes pointing to sequence
 */
export interface SplitEmojiName {
	// Base name
	base: string;

	// Unique key, based on base name and non-component variations
	key: string;

	// Variations
	variations?: (string | EmojiSequenceComponentEntry)[];

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
	const variations: (string | EmojiSequenceComponentEntry)[] = parts
		.join(nameSplit)
		.split(variationSplit)
		.filter((text) => {
			const type = componentsData.types[text];
			if (!type) {
				// Not a component
				return !ignoredVariations.has(text);
			}

			// Component
			return false;
		});

	const key =
		base +
		(variations.length ? nameSplit + variations.join(variationSplit) : '');
	const result: SplitEmojiName = {
		base,
		key,
	};

	// Check sequence for variations
	let components = 0;
	for (let index = 0; index < sequence.length; index++) {
		const num = sequence[index];
		for (const key in emojiComponents) {
			const type = key as EmojiComponentType;
			const range = emojiComponents[type];
			if (num >= range[0] && num < range[1]) {
				// Within range
				variations.push({
					index,
					type,
				});
				components++;
			}
		}
	}

	if (variations.length) {
		result.variations = variations;
	}
	if (components) {
		result.components = components;
	}

	return result;
}
