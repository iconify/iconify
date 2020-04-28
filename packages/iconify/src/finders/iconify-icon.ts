import { IconifyFinder } from '../interfaces/finder';
import { IconifyElement } from '../element';
import { IconifyIconCustomisations } from '@iconify/core/lib/customisations';
import { finder as iconifyFinder } from './iconify';

const selector = 'iconify-icon';
const selectors = selector + ', i.' + selector + ', span.' + selector;

/**
 * Export finder for:
 *  <iconify-icon />
 */
const finder: IconifyFinder = {
	/**
	 * Find all elements
	 */
	find: (root: HTMLElement): NodeList => root.querySelectorAll(selectors),

	/**
	 * Get icon name from element
	 */
	name: iconifyFinder.name,

	/**
	 * Get customisations list from element
	 */
	customisations: (node: IconifyElement): IconifyIconCustomisations => {
		return iconifyFinder.customisations(node, {
			inline: false,
		});
	},

	/**
	 * Filter classes
	 */
	classFilter: iconifyFinder.classFilter,
};

export { finder };
