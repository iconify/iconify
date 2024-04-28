import plugin from 'tailwindcss/plugin';
import { getCSSRulesForIcons } from './clean';
import { getDynamicCSSRules } from './dynamic';
import type {
	CleanIconifyPluginOptions,
	DynamicIconifyPluginOptions,
} from './options';

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
 * Export types
 */
export type { CleanIconifyPluginOptions, DynamicIconifyPluginOptions };
