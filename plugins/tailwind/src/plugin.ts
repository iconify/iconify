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
	const rules = getCSSRules(icons, options);
	return plugin(({ addUtilities }) => {
		addUtilities(rules);
	});
}

/**
 * Export stuff
 */
export default iconifyPlugin;

export type { IconifyPluginOptions };
