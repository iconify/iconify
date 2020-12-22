import { replaceIDs } from './ids';
import { calculateSize } from './calc-size';

/**
 * Interface for exported builder functions
 */
export interface IconifyBuilderFunctions {
	replaceIDs: (body: string, prefix?: string | (() => string)) => string;
	calculateSize: (
		size: string | number,
		ratio: number,
		precision?: number
	) => string | number;
}

/**
 * Exported builder functions
 */
export const builderFunctions: IconifyBuilderFunctions = {
	replaceIDs,
	calculateSize,
};
