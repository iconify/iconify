import type {
	IconifyDimenisons,
	IconifyIcon,
	IconifyOptional,
	IconifyTransformations,
} from '@iconify/types';
import { defaultIconDimensions } from './defaults';
import { mergeIconTransformations } from './transformations';

// Props to copy: all icon properties, except transformations
type PropsToCopy = Omit<IconifyIcon, keyof IconifyTransformations>;
const propsToMerge: Required<PropsToCopy> = {
	...defaultIconDimensions,
	body: '',
};

/**
 * Merge icon and alias
 *
 * Can also be used to merge default values and icon
 */
export function mergeIconData<T extends IconifyOptional>(
	parent: T,
	child: IconifyOptional | IconifyIcon,
	keepOtherParentProps = true
): T {
	// Merge transformations
	const result = mergeIconTransformations(
		parent,
		child,
		keepOtherParentProps
	);

	// Merge icon properties that aren't transformations
	for (const key in propsToMerge) {
		const prop = key as keyof IconifyDimenisons;
		if (child[prop] !== void 0) {
			result[prop] = child[prop];
		} else if (parent[prop] !== void 0) {
			result[prop] = parent[prop];
		}
	}

	return result;
}
