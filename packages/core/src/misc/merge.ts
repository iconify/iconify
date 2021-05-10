type MergeObject = Record<string, unknown>;

/**
 * Merge two objects
 *
 * Replacement for Object.assign() that is not supported by IE, so it cannot be used in production yet.
 */
export function merge<T>(item1: T, item2?: T, item3?: T): T {
	const result: MergeObject = Object.create(null);
	const items = [item1, item2, item3];

	for (let i = 0; i < 3; i++) {
		const item = items[i];
		if (typeof item === 'object' && item) {
			for (const key in item) {
				const value = (item as MergeObject)[key];
				if (value !== void 0) {
					result[key] = value;
				}
			}
		}
	}

	return result as T;
}
