import type { IconifyIconCustomisations } from './defaults';

const separator = /[\s,]+/;

/**
 * Additional shorthand customisations
 */
export interface ShorthandIconCustomisations {
	// Sets both hFlip and vFlip
	flip?: string;
}

/**
 * Apply "flip" string to icon customisations
 */
export function flipFromString(
	custom: IconifyIconCustomisations,
	flip: string
): void {
	flip.split(separator).forEach((str) => {
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
