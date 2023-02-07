import { getIconsCSSData } from '@iconify/utils/lib/css/icons';
import { loadIconSet } from './loader';
import { getIconNames } from './names';
import type { CleanIconifyPluginOptions } from './options';

/**
 * Get CSS rules for icons list
 */
export function getCSSRulesForIcons(
	icons: string[] | string,
	options: CleanIconifyPluginOptions = {}
): Record<string, Record<string, string>> {
	const rules = Object.create(null) as Record<string, Record<string, string>>;

	// Get all icons
	const prefixes = getIconNames(icons);

	// Parse all icon sets
	for (const prefix in prefixes) {
		const iconSet = loadIconSet(prefix, options);
		if (!iconSet) {
			throw new Error(
				`Cannot load icon set for "${prefix}". Install "@iconify-json/${prefix}" as dev dependency?`
			);
		}
		const generated = getIconsCSSData(
			iconSet,
			Array.from(prefixes[prefix]),
			options
		);

		const result = generated.common
			? [generated.common, ...generated.css]
			: generated.css;
		result.forEach((item) => {
			const selector =
				item.selector instanceof Array
					? item.selector.join(', ')
					: item.selector;
			rules[selector] = item.rules;
		});
	}

	return rules;
}
