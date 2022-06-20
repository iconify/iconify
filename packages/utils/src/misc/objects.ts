/**
 * Compares two objects, returns true if identical
 *
 * Reference object contains keys
 */
export function compareObjects<T extends Record<string, unknown>>(
	obj1: T,
	obj2: T,
	ref: T = obj1
): boolean {
	for (const key in ref) {
		if (obj1[key] !== obj2[key]) {
			return false;
		}
	}
	return Object.keys(obj1).length === Object.keys(obj2).length;
}

/**
 * Unmerge objects, removing items that match in both objects
 */
export function unmergeObjects<T extends Record<string, unknown>>(
	obj1: T,
	obj2: T
): T {
	const result = {
		...obj1,
	};
	for (const key in obj2) {
		if (result[key] === obj2[key]) {
			delete result[key];
		}
	}
	return result;
}

/**
 * Get common properties in 2 objects
 */
export function commonObjectProps<T extends Record<string, unknown>>(
	item: unknown,
	reference: T
): Partial<T> {
	const result = {} as T;
	for (const key in reference) {
		const value = (item as T)[key];
		if (value !== void 0) {
			result[key] = value;
		}
	}
	return result;
}
