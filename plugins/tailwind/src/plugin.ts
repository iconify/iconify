import plugin from 'tailwindcss/plugin';
import { getCSSRulesForIcons } from './clean';
import { getDynamicCSSRules } from './dynamic';
import type {
	CleanIconifyPluginOptions,
	DynamicIconifyPluginOptions,
	IconifyPluginOptions,
	IconifyPluginOptionsObject,
} from './helpers/options';
import { getCommonCSSRules } from '@iconify/utils/lib/css/common';

/**
 * Generate styles for dynamic selector: class="icon-[mdi-light--home]"
 */
export function addDynamicIconSelectors(options?: DynamicIconifyPluginOptions) {
	const prefix = options?.prefix || 'icon';
	return plugin(({ matchComponents }) => {
		matchComponents({
			[prefix]: (icon: string) => {
				try {
					return getDynamicCSSRules(icon, options);
				} catch (err) {
					// Log error, but do not throw it
					console.error(err.message);
				}
			},
		});
	});
}

/**
 * Generate styles for preset list of icons
 */
export function addCleanIconSelectors(
	icons: string[] | string,
	options?: CleanIconifyPluginOptions
) {
	const rules = getCSSRulesForIcons(icons, options);
	return plugin(({ addUtilities }) => {
		addUtilities(rules);
	});
}

/**
 * Iconify plugin
 *
 * TODO: export it when ready
 */
function iconifyPlugin(options: IconifyPluginOptions) {
	return plugin(({ addUtilities }) => {
		const rules = Object.create(null) as Record<
			string,
			Record<string, string>
		>;

		// Convert options to object
		const fullOptions: IconifyPluginOptionsObject = Array.isArray(options)
			? {
					prefixes: options,
			  }
			: options;

		// Variable name, default to 'svg' (cannot be empty string)
		const varName = fullOptions.varName || 'svg';

		// Add common rules
		const mask = fullOptions.mask ?? '.iconify';
		const background = fullOptions.background ?? '.iconify-color';
		if (mask) {
			rules[mask] = getCommonCSSRules({
				mode: 'mask',
				varName,
			});
		}
		if (background) {
			rules[background] = getCommonCSSRules({
				mode: 'background',
				varName,
			});
		}
		addUtilities(rules);

		// TODO: add icon sets
	});
}

/**
 * Export types
 */
export type {
	CleanIconifyPluginOptions,
	DynamicIconifyPluginOptions,
	IconifyPluginOptions,
};
