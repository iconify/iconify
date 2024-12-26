/* eslint-disable @typescript-eslint/unbound-method */
import plugin from 'tailwindcss/plugin';
import { getDynamicCSSRules } from './dynamic.js';
import type { DynamicIconifyPluginOptions } from './helpers/options.js';

/**
 * Generate styles for dynamic selector
 *
 * Usage in HTML: <span class="icon-[mdi-light--home]" />
 */
function addDynamicIconSelectors(): ReturnType<typeof plugin.withOptions> {
	return plugin.withOptions((params: unknown) => {
		// Clean up options
		const options: DynamicIconifyPluginOptions = {};
		Object.entries(params ?? {}).forEach(([key, value]) => {
			switch (key) {
				case 'prefix':
					if (typeof value === 'string') {
						options.prefix = value;
					}
					break;

				case 'overrideOnly':
				case 'override-only':
				case 'overrideonly':
					if (value === true) {
						options.overrideOnly = true;
					}
					break;

				case 'scale':
					if (typeof value === 'number') {
						options.scale = value;
					}
					break;
			}
		});

		const prefix = options.prefix || 'icon';
		return ({ matchComponents }) => {
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
		};
	});
}

// Export generated plugin. No TypeScript support yet, so export as unknown
const exportedPlugin = addDynamicIconSelectors() as unknown;
export default exportedPlugin;
