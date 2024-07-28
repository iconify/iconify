import plugin from 'tailwindcss/plugin';
import { getCSSRulesForIcons } from './clean';
import { getDynamicCSSRules } from './dynamic';
import type {
	CleanIconifyPluginOptions,
	DynamicIconifyPluginOptions,
	IconifyPluginOptions,
} from './helpers/options';
import {
	cleanupIconifyPluginOptions,
	getCSSComponentsForPlugin,
	getCSSRulesForPlugin,
} from './preparsed';

/**
 * Generate styles for dynamic selector
 *
 * Usage in HTML: <span class="icon-[mdi-light--home]" />
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
					console.error((err as Error).message);
				}
			},
		});
	});
}

/**
 * Generate rules for mask, background and selected icon sets
 *
 * Icons should combine either mask or background selector and icon selector
 *
 * This plugin generates only square icons. Icons that are not square will be resized to fit square.
 *
 * Usage in HTML: <span class="iconify mdi-light--home" />
 */
export function addIconSelectors(options: IconifyPluginOptions) {
	const fullOptions = cleanupIconifyPluginOptions(options);

	return plugin(({ addComponents, addUtilities }) => {
		addComponents(getCSSComponentsForPlugin(fullOptions));
		addUtilities(getCSSRulesForPlugin(fullOptions));
	});
}

/**
 * Generate styles for preset list of icons
 *
 * Requires knowing full list of icons
 *
 * Usage in HTML: <span class="icon--mdi-light icon--mdi-light--home" />
 *
 * @deprecated Use addIconSelectors instead
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
export type {
	CleanIconifyPluginOptions,
	DynamicIconifyPluginOptions,
	IconifyPluginOptions,
};
