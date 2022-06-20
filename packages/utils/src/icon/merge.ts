import type { IconifyTransformations } from '@iconify/types';
import {
	defaultExtendedIconProps,
	defaultIconTransformations,
	PartialExtendedIconifyIcon,
} from './defaults';
import { mergeIconTransformations } from './transformations';

/**
 * Merge icon and alias
 *
 * Can also be used to merge default values and icon
 */
export function mergeIconData<T extends PartialExtendedIconifyIcon>(
	parent: T,
	child: PartialExtendedIconifyIcon
): T {
	// Merge transformations and add defaults
	const result = mergeIconTransformations(parent, child);

	// Merge icon properties that aren't transformations
	for (const key in defaultExtendedIconProps) {
		// Add default transformations if needed
		if (
			defaultIconTransformations[key as keyof IconifyTransformations] !==
			void 0
		) {
			if (
				result[key as 'rotate'] === void 0 &&
				parent[key as keyof T] !== void 0
			) {
				result[key as 'rotate'] =
					defaultIconTransformations[key as 'rotate'];
			}
			// Not transformation
		} else if (child[key as 'width'] !== void 0) {
			result[key as 'width'] = child[key as 'width'];
		} else if (parent[key as 'width'] !== void 0) {
			result[key as 'width'] = parent[key as 'width'];
		}
	}

	return result;
}
