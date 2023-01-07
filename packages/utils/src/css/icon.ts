import type { IconifyIcon } from '@iconify/types';
import { defaultIconProps } from '../icon/defaults';
import { generateItemCSSRules, getCommonCSSRules } from './common';
import { formatCSS } from './format';
import type { IconCSSIconOptions } from './types';

/**
 * Get CSS for icon
 */
export function getIconCSS(
	icon: IconifyIcon,
	options: IconCSSIconOptions = {}
): string {
	// Get mode
	const mode =
		options.mode ||
		(options.color || icon.body.indexOf('currentColor') === -1
			? 'background'
			: 'mask');

	// Get variable name
	let varName = options.varName;
	if (varName === void 0 && mode === 'mask') {
		// Use 'svg' variable for masks to reduce duplication
		varName = 'svg';
	}

	// Clone options
	const newOptions = {
		...options,
		// Override mode and varName
		mode,
		varName,
	};
	if (mode === 'background') {
		// Variable is not needed for background
		delete newOptions.varName;
	}

	const rules = {
		...getCommonCSSRules(newOptions),
		...generateItemCSSRules({ ...defaultIconProps, ...icon }, newOptions),
	};

	const selector = options.iconSelector || '.icon';
	return formatCSS(
		[
			{
				selector,
				rules,
			},
		],
		newOptions.format
	);
}
