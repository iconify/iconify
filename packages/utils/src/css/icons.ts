import type { IconifyJSON } from '@iconify/types';
import { getIconData } from '../icon-set/get-icon';
import { defaultIconProps } from '../icon/defaults';
import {
	generateItemCSSRules,
	generateItemContent,
	getCommonCSSRules,
} from './common';
import { formatCSS } from './format';
import type {
	CSSUnformattedItem,
	IconCSSIconSetOptions,
	IconCSSSelectorOptions,
	IconContentIconSetOptions,
} from './types';

// Default selectors
const commonSelector = '.icon--{prefix}';
const iconSelector = '.icon--{prefix}--{name}';
const contentSelector = '.icon--{prefix}--{name}::after';
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
	const palette = options.color ? true : undefined;
	let mode =
		options.mode ||
		(typeof palette === 'boolean' && (palette ? 'background' : 'mask'));
	if (!mode) {
		// Attempt to detect mode from first available icon
		for (let i = 0; i < names.length; i++) {
			const name = names[i];
			const icon = getIconData(iconSet, name);
			if (icon) {
				const body = options.customise
					? options.customise(icon.body, name)
					: icon.body;
				mode = body.includes('currentColor') ? 'mask' : 'background';
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
	const commonRules = {
		...options.rules,
		...getCommonCSSRules(newOptions),
	};
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

		const body = options.customise
			? options.customise(iconData.body, name)
			: iconData.body;
		const rules = generateItemCSSRules(
			{
				...defaultIconProps,
				...iconData,
				body,
			},
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
 * Get CSS for icons as background/mask
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

/**
 * Get CSS for icons as content
 */
export function getIconsContentCSS(
	iconSet: IconifyJSON,
	names: string[],
	options: IconContentIconSetOptions
): string {
	const errors: string[] = [];
	const css: CSSUnformattedItem[] = [];
	const iconSelectorWithPrefix = (
		options.iconSelector ?? contentSelector
	).replace(/{prefix}/g, iconSet.prefix);

	// Parse all icons
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const iconData = getIconData(iconSet, name);
		if (!iconData) {
			errors.push('/* Could not find icon: ' + name + ' */');
			continue;
		}

		const body = options.customise
			? options.customise(iconData.body, name)
			: iconData.body;
		const content = generateItemContent(
			{
				...defaultIconProps,
				...iconData,
				body,
			},
			options
		);
		const selector = iconSelectorWithPrefix.replace(/{name}/g, name);

		css.push({
			selector,
			rules: {
				...options.rules,
				content,
			},
		});
	}

	// Format
	return (
		formatCSS(css, options.format) +
		(errors.length ? '\n' + errors.join('\n') + '\n' : '')
	);
}
