import type { IconifyJSON } from '@iconify/types';
import { getIconData } from '../icon-set/get-icon';
import { defaultIconProps } from '../icon/defaults';
import { generateItemCSSRules, getCommonCSSRules } from './common';
import { formatCSS } from './format';
import type {
	CSSUnformattedItem,
	IconCSSIconSetOptions,
	IconCSSSelectorOptions,
} from './types';

// Default selectors
const commonSelector = '.icon--{prefix}';
const iconSelector = '.icon--{prefix}--{name}';
const defaultSelectors: IconCSSSelectorOptions = {
	commonSelector,
	iconSelector,
	overrideSelector: commonSelector + iconSelector,
};

interface CSSData {
	common?: CSSUnformattedItem;
	css: CSSUnformattedItem[];
	errors: string[];
}

/**
 * Get data for getIconsCSS()
 */
export function getIconsCSSData(
	iconSet: IconifyJSON,
	names: string[],
	options: IconCSSIconSetOptions = {}
): CSSData {
	const css: CSSUnformattedItem[] = [];
	const errors: string[] = [];

	// Get mode
	const palette = options.color ? true : iconSet.info?.palette;
	let mode =
		options.mode ||
		(typeof palette === 'boolean' && (palette ? 'background' : 'mask'));
	if (!mode) {
		// Attempt to detect mode from first available icon
		for (let i = 0; i < names.length; i++) {
			const icon = getIconData(iconSet, names[i]);
			if (icon) {
				mode = icon.body.includes('currentColor')
					? 'mask'
					: 'background';
				break;
			}
		}

		if (!mode) {
			// Failed to detect mode
			mode = 'mask';
			errors.push(
				'/* cannot detect icon mode: not set in options and icon set is missing info, rendering as ' +
					mode +
					' */'
			);
		}
	}

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

	const { commonSelector, iconSelector, overrideSelector } =
		newOptions.iconSelector ? newOptions : defaultSelectors;
	const iconSelectorWithPrefix = (iconSelector as string).replace(
		/{prefix}/g,
		iconSet.prefix
	);

	// Get common CSS
	const commonRules = getCommonCSSRules(newOptions);
	const hasCommonRules = commonSelector && commonSelector !== iconSelector;
	const commonSelectors: Set<string> = new Set();
	if (hasCommonRules) {
		css.push({
			selector: commonSelector.replace(/{prefix}/g, iconSet.prefix),
			rules: commonRules,
		});
	}

	// Parse all icons
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const iconData = getIconData(iconSet, name);
		if (!iconData) {
			errors.push('/* Could not find icon: ' + name + ' */');
			continue;
		}

		const rules = generateItemCSSRules(
			{ ...defaultIconProps, ...iconData },
			newOptions
		);

		let requiresOverride = false;
		if (hasCommonRules && overrideSelector) {
			for (const key in rules) {
				if (key in commonRules) {
					requiresOverride = true;
				}
			}
		}

		const selector = (
			requiresOverride && overrideSelector
				? overrideSelector.replace(/{prefix}/g, iconSet.prefix)
				: iconSelectorWithPrefix
		).replace(/{name}/g, name);

		css.push({
			selector,
			rules,
		});
		if (!hasCommonRules) {
			commonSelectors.add(selector);
		}
	}

	// Result
	const result: CSSData = {
		css,
		errors,
	};

	// Add common stuff
	if (!hasCommonRules && commonSelectors.size) {
		const selector = Array.from(commonSelectors).join(
			newOptions.format === 'compressed' ? ',' : ', '
		);
		result.common = {
			selector,
			rules: commonRules,
		};
	}

	return result;
}

/**
 * Get CSS for icon
 */
export function getIconsCSS(
	iconSet: IconifyJSON,
	names: string[],
	options: IconCSSIconSetOptions = {}
): string {
	const { css, errors, common } = getIconsCSSData(iconSet, names, options);

	// Add common stuff
	if (common) {
		// Check for same selector
		if (css.length === 1 && css[0].selector === common.selector) {
			css[0].rules = {
				// Common first, override later
				...common.rules,
				...css[0].rules,
			};
		} else {
			css.unshift(common);
		}
	}

	// Format
	return (
		formatCSS(css, options.format) +
		(errors.length ? '\n' + errors.join('\n') + '\n' : '')
	);
}
