import {
	EmojiRegexMatch,
	getEmojiMatchesInText,
	sortEmojiMatchesInText,
} from './find';

/**
 * Callback for replacing emoji in text
 *
 * Returns text to replace emoji with, undefined to skip replacement
 */
export type FindAndReplaceEmojisInTextCallback = (
	// Match
	match: EmojiRegexMatch,
	// Text before replacement
	prev: string
) => string | undefined;

/**
 * Find and replace emojis in text
 *
 * Returns null if nothing was replaced
 */
export function findAndReplaceEmojisInText(
	regexp: string | RegExp | (string | RegExp)[],
	content: string,
	callback: FindAndReplaceEmojisInTextCallback
): string | null {
	const matches = getEmojiMatchesInText(regexp, content);
	if (!matches.length) {
		return null;
	}

	const sortedMatches = sortEmojiMatchesInText(content, matches);

	// Replace all matches
	let result = '';
	let replaced = false;
	for (let i = 0; i < sortedMatches.length; i++) {
		const item = sortedMatches[i];
		result += item.prev;
		const replacement = callback(
			{
				...item.match,
			},
			result
		);
		if (replacement === void 0) {
			// Nothing to replace
			result += item.match.match;
		} else {
			// Replace content
			result += replacement;
			replaced = true;
		}
	}
	result += sortedMatches[sortedMatches.length - 1].next;

	return replaced ? result : null;
}
