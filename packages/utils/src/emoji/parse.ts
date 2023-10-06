import type { IconifyJSON } from '@iconify/types';
import {
	getEmojiSequenceFromString,
	getUnqualifiedEmojiSequence,
} from './cleanup';
import { getEmojiSequenceKeyword } from './format';
import { createOptimisedRegexForEmojiSequences } from './regex/create';
import { findMissingEmojis } from './test/missing';
import { parseEmojiTestFile } from './test/parse';
import { combineSimilarEmojiTestData } from './test/similar';
import { getEmojiTestDataTree } from './test/tree';
import { getQualifiedEmojiVariations } from './test/variations';

/**
 * Parsed icon
 */
export interface PreparedEmojiIcon {
	// Icon name
	icon: string;

	// Emoji sequence as string
	sequence: string;
}

/**
 * Parse
 */
export interface PreparedEmojiResult {
	// List of icons
	icons: PreparedEmojiIcon[];

	// Regular expression
	regex: string;
}

/**
 * Prepare emoji for icons list
 *
 * Test data should be fetched from 'https://unicode.org/Public/emoji/15.1/emoji-test.txt'
 * It is used to detect missing emojis and optimise regular expression
 */
export function prepareEmojiForIconsList(
	icons: Record<string, string>,
	rawTestData?: string
): PreparedEmojiResult {
	// Prepare test data
	const testData = rawTestData ? parseEmojiTestFile(rawTestData) : void 0;

	// Convert icons to object
	interface IconsListItem {
		icon: string;
		sequence: number[];
	}
	let iconsList: IconsListItem[] = [];
	for (const char in icons) {
		const sequence = getEmojiSequenceFromString(char);
		iconsList.push({
			icon: icons[char],
			sequence,
		});
	}

	// Get fully-qualified versions of emojis
	iconsList = getQualifiedEmojiVariations(iconsList);

	// Find and add missing emojis if test data is available
	if (testData) {
		iconsList = iconsList.concat(
			findMissingEmojis(
				iconsList,
				getEmojiTestDataTree(combineSimilarEmojiTestData(testData))
			)
		);
	}

	// Prepare icons list
	const preparedIcons: PreparedEmojiIcon[] = iconsList.map((item) => {
		const sequence = getEmojiSequenceKeyword(
			getUnqualifiedEmojiSequence(item.sequence)
		);
		return {
			icon: item.icon,
			sequence,
		};
	});

	// Prepare regex
	const regex = createOptimisedRegexForEmojiSequences(
		iconsList.map((item) => item.sequence)
	);

	return {
		regex,
		icons: preparedIcons,
	};
}

/**
 * Prepare emoji for an icon set
 *
 * Test data should be fetched from 'https://unicode.org/Public/emoji/15.1/emoji-test.txt'
 * It is used to detect missing emojis and optimise regular expression
 */
export function prepareEmojiForIconSet(
	iconSet: IconifyJSON,
	rawTestData?: string
): PreparedEmojiResult {
	return prepareEmojiForIconsList(iconSet.chars || {}, rawTestData);
}
