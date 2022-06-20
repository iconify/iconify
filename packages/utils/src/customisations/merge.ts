import { mergeIconTransformations } from '../icon/transformations';
import {
	defaultIconSizeCustomisations,
	FullIconCustomisations,
	IconifyIconCustomisations,
	IconifyIconSizeCustomisations,
} from './defaults';

/**
 * Convert IconifyIconCustomisations to FullIconCustomisations
 */
export function mergeCustomisations<T extends FullIconCustomisations>(
	defaults: T,
	item: IconifyIconCustomisations,
	keepOtherProps = true
): T {
	// Merge transformations
	const result = mergeIconTransformations(defaults, item, keepOtherProps);

	// Merge dimensions
	for (const key in defaultIconSizeCustomisations) {
		const attr = key as keyof IconifyIconSizeCustomisations;

		const value = item[attr];
		const valueType = typeof value;
		if (
			value === null ||
			(value && (valueType === 'string' || valueType === 'number'))
		) {
			result[attr] = value;
		} else {
			(result as Record<string, unknown>)[attr] = defaults[attr];
		}
	}

	return result;
}
