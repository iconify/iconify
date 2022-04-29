import type { FullIconCustomisations } from '@iconify/utils/lib/customisations';
import { defaults } from '@iconify/utils/lib/customisations';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/utils/lib/customisations/shorthand';

// Remove 'inline' from defaults
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { inline, ...defaultCustomisations } = defaults;
export { defaultCustomisations };

/**
 * Customisations that affect rendering
 */
export type RenderedIconCustomisations = Omit<FullIconCustomisations, 'inline'>;

/**
 * Get customisations
 */
export function getCustomisations(node: Element): RenderedIconCustomisations {
	const customisations = {
		...defaultCustomisations,
	};

	const attr = (key: string, def: string | null) =>
		node.getAttribute(key) || def;

	// Dimensions
	customisations.width = attr('width', null);
	customisations.height = attr('height', null);

	// Rotation
	customisations.rotate = rotateFromString(attr('rotate', ''));

	// Flip
	flipFromString(customisations, attr('flip', ''));

	// Alignment
	alignmentFromString(customisations, attr('align', ''));

	return customisations;
}

/**
 * Check if customisations have been updated
 */
export function haveCustomisationsChanged(
	value1: RenderedIconCustomisations,
	value2: RenderedIconCustomisations
): boolean {
	for (const key in defaultCustomisations) {
		if (value1[key] !== value2[key]) {
			return true;
		}
	}

	return false;
}
