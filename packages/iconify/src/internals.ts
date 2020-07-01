import { IconifyIconSize } from '@iconify/core/lib/customisations';

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyExposedCommonInternals {
	/**
	 * Calculate width knowing height and width/height ratio (or vice versa)
	 */
	calculateSize: (
		size: IconifyIconSize,
		ratio: number,
		precision?: number
	) => IconifyIconSize;
}
