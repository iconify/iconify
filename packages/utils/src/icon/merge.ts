import type { IconifyDimenisons, IconifyOptional } from '@iconify/types';
import { defaultIconDimensions } from './defaults';
import { mergeIconTransformations } from './transformations';

/**
 * Merge icon and alias
 */
export function mergeIconData<T extends IconifyOptional>(
	icon: T,
	alias: IconifyOptional
): T {
	// Merge transformations, while keeping other props
	const result = mergeIconTransformations(icon, alias);

	// Merge dimensions
	for (const key in defaultIconDimensions) {
		const prop = key as keyof IconifyDimenisons;
		if (alias[prop] !== void 0) {
			result[prop] = alias[prop];
		}
	}

	return result;
}
