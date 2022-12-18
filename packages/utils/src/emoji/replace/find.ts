import { convertEmojiSequenceToUTF32 } from '../convert';
import { vs16Emoji } from '../data';
import { getEmojiSequenceKeyword } from '../format';

/**
 * Create regular expression instance
 */
export function createEmojiRegExp(regexp: string): RegExp {
	return new RegExp(regexp, 'g');
}

/**
 * Match
 */
export interface EmojiRegexMatch {
	// Match to replace in text
	match: string;

	// Sequence
	sequence: number[];

	// Icon name
	keyword: string;
}

/**
 * Add prev/next
 */
interface PrevMatch {
	// Match
	match: EmojiRegexMatch;

	// Content between previous emoji and this emoji
	prev: string;
}

interface PrevNextMatch extends PrevMatch {
	// Content betweed this emoji and next emoji
	next: string;
}

/**
 * Find emojis in text
 *
 * Returns only one entry per match
 */
export function getEmojiMatchesInText(
	regexp: string | RegExp,
	content: string
): EmojiRegexMatch[] {
	const results: EmojiRegexMatch[] = [];
	const matches = content.match(
		typeof regexp === 'string' ? createEmojiRegExp(regexp) : regexp
	);

	if (matches) {
		// Sort matches by length to make sure longest matches get replaced first
		matches.sort((a, b) => {
			if (b.length === a.length) {
				return a.localeCompare(b);
			}
			return b.length - a.length;
		});

		// Add all matches
		let lastMatch: EmojiRegexMatch | undefined;
		for (let i = 0; i < matches.length; i++) {
			const match = matches[i];

			if (lastMatch && lastMatch.match === match) {
				continue;
			}

			// Get sequence
			const sequence: number[] = [];
			for (const codePoint of match) {
				const num = codePoint.codePointAt(0) as number;
				if (num !== vs16Emoji) {
					sequence.push(num);
				}
			}

			// Get keyword
			const keyword = getEmojiSequenceKeyword(
				convertEmojiSequenceToUTF32(sequence)
			);

			lastMatch = {
				match,
				sequence,
				keyword,
			};
			results.push(lastMatch);
		}
	}

	return results;
}

/**
 * Sort emojis, get prev and next text
 */
export function sortEmojiMatchesInText(
	content: string,
	matches: EmojiRegexMatch[]
): PrevNextMatch[] {
	// Find all ranges
	interface Range {
		match: EmojiRegexMatch;
		start: number;
		end: number;
	}
	const ranges: Range[] = [];

	const check = (start: number, end: number): boolean => {
		for (let i = 0; i < ranges.length; i++) {
			if (start < ranges[i].end && end >= ranges[i].start) {
				return false;
			}
		}
		return true;
	};

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const search = match.match;

		let startFrom = 0;
		let start: number;
		while ((start = content.indexOf(search, startFrom)) !== -1) {
			const end = start + search.length;
			startFrom = end;

			// Make sure it doesn't interfere with other replacements
			if (check(start, end)) {
				ranges.push({
					start,
					end,
					match,
				});
			}
		}
	}

	// Sort ranges
	ranges.sort((a, b) => a.start - b.start);
	const list: PrevMatch[] = [];
	let prevRange: Range | undefined;
	let lastEnd: number | undefined;
	for (let i = 0; i < ranges.length; i++) {
		const range = ranges[i];
		const prev = content.slice(prevRange ? prevRange.end : 0, range.start);
		list.push({
			match: range.match,
			prev,
		});
		prevRange = range;
		lastEnd = range.end;
	}

	// Convert to full data
	if (!lastEnd) {
		// Empty list
		return [];
	}

	const replacements: PrevNextMatch[] = list.map((item, index) => {
		const nextItem = list[index + 1];
		return {
			...item,
			next: nextItem ? nextItem.prev : content.slice(lastEnd),
		};
	});

	return replacements;
}
