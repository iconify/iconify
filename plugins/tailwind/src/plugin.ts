import plugin from 'tailwindcss/plugin';
import { getCSSRules } from './iconify';
import type { IconifyPluginOptions } from './options';

/**
 * Iconify plugin
 */
function iconifyPlugin(
	icons: string[] | string,
	options: IconifyPluginOptions = {}
) {
	return plugin(({ addUtilities }) => {
		const rules = getCSSRules(icons, options);
		addUtilities(rules);
	});
}

/**
 * Export stuff
 */
export default iconifyPlugin;

export type { IconifyPluginOptions };
