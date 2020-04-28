import { IconifyIconCustomisations } from '../customisations';

const separator = /[\s,]+/;

/**
 * Additional shorthand customisations
 */
export interface ShorthandIconCustomisations {
	// Sets both hFlip and vFlip
	flip?: string;

	// Sets hAlign, vAlign and slice
	align?: string;
}

/**
 * Apply "flip" string to icon customisations
 */
export function flipFromString(
	custom: IconifyIconCustomisations,
	flip: string
): void {
	flip.split(separator).forEach(str => {
		const value = str.trim();
		switch (value) {
			case 'horizontal':
				custom.hFlip = true;
				break;

			case 'vertical':
				custom.vFlip = true;
				break;
		}
	});
}

/**
 * Apply "align" string to icon customisations
 */
export function alignmentFromString(
	custom: IconifyIconCustomisations,
	align: string
): void {
	align.split(separator).forEach(str => {
		const value = str.trim();
		switch (value) {
			case 'left':
			case 'center':
			case 'right':
				custom.hAlign = value;
				break;

			case 'top':
			case 'middle':
			case 'bottom':
				custom.vAlign = value;
				break;

			case 'slice':
				custom.slice = true;
				break;

			case 'meet':
				custom.slice = false;
		}
	});
}
