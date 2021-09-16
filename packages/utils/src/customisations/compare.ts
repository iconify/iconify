import type { FullIconCustomisations } from './index';
import { defaults } from './index';

// Get all keys
const allKeys: (keyof FullIconCustomisations)[] = Object.keys(
	defaults
) as (keyof FullIconCustomisations)[];

// All keys without width/height
const filteredKeys = allKeys.filter(
	(key) => key !== 'width' && key !== 'height'
);

/**
 * Compare sets of cusotmisations, return false if they are different, true if the same
 *
 * If dimensions are derived from props1 or props2, do not compare them.
 */
export function compare(
	item1: FullIconCustomisations,
	item2: FullIconCustomisations,
	compareDimensions = true
): boolean {
	const keys = compareDimensions ? allKeys : filteredKeys;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (item1[key] !== item2[key]) {
			return false;
		}
	}
	return true;
}
