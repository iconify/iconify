import plugin from 'tailwindcss/plugin';
import { getCSSRules, getDynamicCSSRules } from './iconify';
import type { IconifyPluginOptions } from './options';

/**
 * Iconify plugin
 */
function iconifyPlugin(
	icons?: string[] | string,
	options?: IconifyPluginOptions
) {
	const passedOptions =
		typeof icons === 'object' && !(icons instanceof Array)
			? icons
			: options || {};
	const passedIcons =
		typeof icons !== 'object' || icons instanceof Array ? icons : void 0;

	// Get selector for dynamic classes
	const dynamicSelector = passedOptions.dynamicPrefix || 'icon';

	// Get hardcoded list of icons
	const rules = passedIcons
		? getCSSRules(passedIcons, passedOptions)
		: void 0;

	return plugin(({ addUtilities, matchComponents }) => {
		if (rules) {
			addUtilities(rules);
		}
		matchComponents({
			[dynamicSelector]: (icon: string) =>
				getDynamicCSSRules(
					`.${dynamicSelector}-[${icon}]`,
					icon,
					passedOptions
				),
		});
	});
}

/**
 * Export stuff
 */
export default iconifyPlugin;

export type { IconifyPluginOptions };
