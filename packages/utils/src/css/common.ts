import type { IconifyIcon } from '@iconify/types';
import { iconToHTML } from '../svg/html';
import { calculateSize } from '../svg/size';
import { svgToURL } from '../svg/url';
import type {
	IconCSSCommonCodeOptions,
	IconCSSItemOptions,
	IconContentItemOptions,
} from './types';
import { makeIconSquare } from '../icon/square';

/**
 * Generates common CSS rules for multiple icons, rendered as background/mask
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
 * Generate CSS rules for one icon, rendered as background/mask
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
	if (icon.width !== icon.height) {
		if (options.forceSquare) {
			// Change viewBox
			icon = makeIconSquare(icon);
		} else {
			// Change width in result
			result['width'] = calculateSize('1em', icon.width / icon.height);
		}
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

/**
 * Generate content for one icon, rendered as content of pseudo-selector
 */
export function generateItemContent(
	icon: Required<IconifyIcon>,
	options: IconContentItemOptions
): string {
	// Get dimensions
	const height = options.height;
	const width =
		options.width ?? calculateSize(height, icon.width / icon.height);

	// Get SVG
	const svg = iconToHTML(
		icon.body.replace(/currentColor/g, options.color || 'black'),
		{
			viewBox: `${icon.left} ${icon.top} ${icon.width} ${icon.height}`,
			width: width.toString(),
			height: height.toString(),
		}
	);

	// Generate URL
	return svgToURL(svg);
}
