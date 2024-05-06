import { getIconsCSSData } from '@iconify/utils/lib/css/icons';
import { loadIconSet } from './helpers/loader';
import { getIconNames } from './helpers/names';
import type { CleanIconifyPluginOptions } from './helpers/options';

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
		const iconSet = loadIconSet(options.iconSets?.[prefix] || prefix);
		if (!iconSet) {
			throw new Error(
				`Cannot load icon set for "${prefix}". Install "@iconify-json/${prefix}" as dev dependency?`
			);
		}

		const generated = getIconsCSSData(
			iconSet,
			Array.from(prefixes[prefix]),
			{
				...options,
				customise: (content, name) =>
					options.customise?.(content, name, prefix) ?? content,
			}
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
