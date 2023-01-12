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
			[prefix]: (icon: string) => getDynamicCSSRules(icon, options),
		});
	});
}

/**
 * Generate styles for preset list of icons
 */
export function addCleanIconSelectors(
	icons?: string[] | string,
	options?: CleanIconifyPluginOptions
) {
	const passedOptions =
		typeof icons === 'object' && !(icons instanceof Array)
			? icons
			: options || {};
	const passedIcons =
		typeof icons !== 'object' || icons instanceof Array ? icons : void 0;

	// Get hardcoded list of icons
	const rules = passedIcons
		? getCSSRulesForIcons(passedIcons, passedOptions)
		: void 0;

	return plugin(({ addUtilities, matchComponents }) => {
		addUtilities(rules);
	});
}

/**
 * Export types
 */
export type { CleanIconifyPluginOptions, DynamicIconifyPluginOptions };
