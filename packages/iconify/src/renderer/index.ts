import { IconifyIconCustomisations } from '@iconify/core/lib/customisations';
import { IconifyIconBuildResult } from '@iconify/core/lib/builder';

/**
 * Iconify interface
 */
export interface IconifyRenderer {
	/**
	 * Render icons
	 */
	renderSVG: (
		name: string,
		customisations: IconifyIconCustomisations
	) => SVGElement | null;

	renderHTML: (
		name: string,
		customisations: IconifyIconCustomisations
	) => string | null;

	/**
	 * Get icon data
	 */
	renderIcon: (
		name: string,
		customisations: IconifyIconCustomisations
	) => IconifyIconBuildResult | null;

	/**
	 * Replace IDs in icon body, should be used when parsing buildIcon() result
	 */
	replaceIDs: (body: string) => string;
}
