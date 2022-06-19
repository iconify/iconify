import type { IconifyTransformations } from '@iconify/types';

/**
 * Merge transformations. Also copies other properties from first parameter
 */
export function mergeIconTransformations<T extends IconifyTransformations>(
	obj1: T,
	obj2: IconifyTransformations
): T {
	const result = {
		...obj1,
	};
	if (obj2.hFlip) {
		result.hFlip = !result.hFlip;
	}
	if (obj2.vFlip) {
		result.vFlip = !result.vFlip;
	}
	if (obj2.rotate) {
		result.rotate = ((result.rotate || 0) + obj2.rotate) % 4;
	}
	return result;
}
