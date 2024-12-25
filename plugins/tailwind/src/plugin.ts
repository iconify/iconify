/* eslint-disable @typescript-eslint/unbound-method */
import plugin from 'tailwindcss/plugin';
import { getDynamicCSSRules } from './dynamic.js';

/**
 * Generate styles for dynamic selector
 *
 * Usage in HTML: <span class="icon-[mdi-light--home]" />
 */
function addDynamicIconSelectors(): ReturnType<typeof plugin> {
	const prefix = 'icon';
	return plugin(({ matchComponents }) => {
		matchComponents({
			[prefix]: (icon: string) => {
				try {
					return getDynamicCSSRules(icon);
				} catch (err) {
					// Log error, but do not throw it
					console.error((err as Error).message);
					return {};
				}
			},
		});
	});
}

// Export generated plugin. No TypeScript support yet, so export as unknown
const exportedPlugin = addDynamicIconSelectors() as unknown;
export default exportedPlugin;
