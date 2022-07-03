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
		if (key in defaultIconTransformations) {
			if (key in parent && !(key in result)) {
				result[key as 'rotate'] =
					defaultIconTransformations[key as 'rotate'];
			}
			// Not transformation
		} else if (key in child) {
			result[key as 'width'] = child[key as 'width'];
		} else if (key in parent) {
			result[key as 'width'] = parent[key as 'width'];
		}
	}

	return result;
}
