import type { FullIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import type { IconifyIconSVGAttributes } from './types';

/**
 * Customisations that affect rendering
 */
export type RenderedIconCustomisations = FullIconCustomisations &
	IconifyIconSVGAttributes;

const defaultCustomisations = {
	...defaultIconCustomisations,
	preserveAspectRatio: '',
} as IconifyIconSVGAttributes & FullIconCustomisations;
export { defaultCustomisations };

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

	// SVG attributes
	customisations.preserveAspectRatio = attr(
		'preserveAspectRatio',
		attr('preserveaspectratio', '')
	);

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
