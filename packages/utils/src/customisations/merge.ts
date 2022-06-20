import {
	defaultIconSizeCustomisations,
	FullIconCustomisations,
	IconifyIconCustomisations,
	IconifyIconSizeCustomisations,
} from './defaults';

/**
 * Convert IconifyIconCustomisations to FullIconCustomisations, checking value types
 */
export function mergeCustomisations<T extends FullIconCustomisations>(
	defaults: T,
	item: IconifyIconCustomisations
): T {
	// Copy default values
	const result = {
		...defaults,
	};

	// Merge all properties
	for (const key in item) {
		const value = item[key as keyof IconifyIconCustomisations];
		const valueType = typeof value;

		if (key in defaultIconSizeCustomisations) {
			// Dimension
			if (
				value === null ||
				(value && (valueType === 'string' || valueType === 'number'))
			) {
				result[key as keyof IconifyIconSizeCustomisations] =
					value as string;
			}
		} else if (valueType === typeof result[key as keyof T]) {
			// Normalise rotation, copy everything else as is
			(result as Record<string, unknown>)[key] =
				key === 'rotate' ? (value as number) % 4 : value;
		}
	}

	return result;
}
