import plugin from 'tailwindcss/plugin';
import { getCSSRules } from './iconify';
/**
 * Iconify plugin
 */
function iconifyPlugin(icons, options = {}) {
    return plugin(({ addUtilities }) => {
        const rules = getCSSRules(icons, options);
        addUtilities(rules);
    });
}
/**
 * Export stuff
 */
export default iconifyPlugin;
