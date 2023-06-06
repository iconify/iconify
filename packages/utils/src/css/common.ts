import type { IconifyIcon } from '@iconify/types';
import { iconToHTML } from '../svg/html';
import { calculateSize } from '../svg/size';
import { svgToURL } from '../svg/url';
import type { IconCSSCommonCodeOptions, IconCSSItemOptions } from './types';

/**
 * Generates common CSS rules for multiple icons
 */
export function getCommonCSSRules(
	options: IconCSSCommonCodeOptions
): Record<string, string> {
	const result = {
		display: 'inline-block',
		width: '1em',
		height: '1em',
	} as Record<string, string>;
	const varName = options.varName;

	if (options.pseudoSelector) {
		result['content'] = "''";
	}

	switch (options.mode) {
		case 'background':
			if (varName) {
				result['background-image'] = 'var(--' + varName + ')';
			}
			result['background-repeat'] = 'no-repeat';
			result['background-size'] = '100% 100%';
			break;

		case 'mask':
			result['background-color'] = 'currentColor';
			if (varName) {
				result['mask-image'] = result['-webkit-mask-image'] =
					'var(--' + varName + ')';
			}
			result['mask-repeat'] = result['-webkit-mask-repeat'] = 'no-repeat';
			result['mask-size'] = result['-webkit-mask-size'] = '100% 100%';
			break;
	}

	return result;
}

/**
 * Generate CSS rules for one icon
 *
 * This function excludes common rules
 */
export function generateItemCSSRules(
	icon: Required<IconifyIcon>,
	options: IconCSSItemOptions
): Record<string, string> {
	const result = {} as Record<string, string>;
	const varName = options.varName;

	// Calculate width
	if (!options.forceSquare && icon.width !== icon.height) {
		result['width'] = calculateSize('1em', icon.width / icon.height);
	}

	// Get SVG
	const svg = iconToHTML(
		icon.body.replace(/currentColor/g, options.color || 'black'),
		{
			viewBox: `${icon.left} ${icon.top} ${icon.width} ${icon.height}`,
			width: icon.width.toString(),
			height: icon.height.toString(),
		}
	);

	// Generate URL
	const url = svgToURL(svg);

	// Generate result
	if (varName) {
		result['--' + varName] = url;
	} else {
		switch (options.mode) {
			case 'background':
				result['background-image'] = url;
				break;

			case 'mask':
				result['mask-image'] = result['-webkit-mask-image'] = url;
				break;
		}
	}

	return result;
}
