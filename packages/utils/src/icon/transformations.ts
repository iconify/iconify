import type { IconifyTransformations } from '@iconify/types';

/**
 * Merge transformations
 */
export function mergeIconTransformations<T extends IconifyTransformations>(
	obj1: T,
	obj2: IconifyTransformations,
	keepOtherProps = true
): T {
	const result = keepOtherProps ? { ...obj1 } : ({} as T);
	if (obj1.hFlip || obj2.hFlip) {
		result.hFlip = obj1.hFlip !== obj2.hFlip;
	}
	if (obj1.vFlip || obj2.vFlip) {
		result.vFlip = obj1.vFlip !== obj2.vFlip;
	}
	if (obj1.rotate || obj2.rotate) {
		result.rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
	}
	return result;
}
