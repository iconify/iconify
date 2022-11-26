import type { CSSFormatMode, CSSUnformattedItem } from './types';

type Item = Record<CSSFormatMode, string>;
interface FormatData {
	selectorStart: Item;
	selectorEnd: Item;
	rule: Item;
}

const format: FormatData = {
	selectorStart: {
		compressed: '{',
		compact: ' {',
		expanded: ' {',
	},
	selectorEnd: {
		compressed: '}',
		compact: '; }\n',
		expanded: ';\n}\n',
	},
	rule: {
		compressed: '{key}:',
		compact: ' {key}: ',
		expanded: '\n  {key}: ',
	},
};

/**
 * Format data
 *
 * Key is selector, value is list of rules
 */
export function formatCSS(
	data: CSSUnformattedItem[],
	mode: CSSFormatMode = 'expanded'
): string {
	const results: string[] = [];

	for (let i = 0; i < data.length; i++) {
		const { selector, rules } = data[i];
		const fullSelector =
			selector instanceof Array
				? selector.join(mode === 'compressed' ? ',' : ', ')
				: selector;

		let entry = fullSelector + format.selectorStart[mode];

		let firstRule = true;
		for (const key in rules) {
			if (!firstRule) {
				entry += ';';
			}
			entry += format.rule[mode].replace('{key}', key) + rules[key];
			firstRule = false;
		}

		entry += format.selectorEnd[mode];
		results.push(entry);
	}

	return results.join(mode === 'compressed' ? '' : '\n');
}
