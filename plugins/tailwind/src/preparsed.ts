import type { IconifyJSON } from '@iconify/types';
import {
	generateItemCSSRules,
	getCommonCSSRules,
} from '@iconify/utils/lib/css/common';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import type {
	IconifyPluginOptions,
	IconifyPluginOptionsObject,
	IconsListOption,
} from './helpers/options';
import { loadIconSet } from './helpers/loader';

/**
 * Convert plugin options to object
 */
export function cleanupIconifyPluginOptions(
	options: IconifyPluginOptions
): IconifyPluginOptionsObject {
	return Array.isArray(options)
		? {
				prefixes: options,
		  }
		: options;
}

/**
 * Get CSS rules for main plugin (components)
 */
export function getCSSComponentsForPlugin(options: IconifyPluginOptionsObject) {
	const rules = Object.create(null) as Record<string, Record<string, string>>;

	// Variable name, default to 'svg' (cannot be empty string)
	const varName = options.varName || 'svg';

	// Scale icons
	const scale = options.scale ?? 1;
	const adjustScale = (obj: Record<string, string>) => {
		if (!scale) {
			// Delete width and height
			delete obj['width'];
			delete obj['height'];
		} else if (scale !== 1) {
			// Set custom width and height
			obj['width'] = scale + 'em';
			obj['height'] = scale + 'em';
		}
		return obj;
	};

	// Add common rules
	const maskSelector = options.maskSelector ?? '.iconify';
	const backgroundSelector = options.backgroundSelector ?? '.iconify-color';
	if (maskSelector) {
		rules[maskSelector] = Object.assign(
			adjustScale(
				getCommonCSSRules({
					mode: 'mask',
					varName,
				})
			),
			options.extraMaskRules || {}
		);
	}
	if (backgroundSelector) {
		rules[backgroundSelector] = Object.assign(
			adjustScale(
				getCommonCSSRules({
					mode: 'background',
					varName,
				})
			),
			options.extraBackgroundRules || {}
		);
	}

	return rules;
}

/**
 * Get CSS rules for main plugin (utilities)
 */
export function getCSSRulesForPlugin(options: IconifyPluginOptionsObject) {
	const rules = Object.create(null) as Record<string, Record<string, string>>;

	// Variable name, default to 'svg' (cannot be empty string)
	const varName = options.varName || 'svg';

	// Add icon sets
	const iconSelector = options.iconSelector || '.{prefix}--{name}';

	// Make icons square
	const square = options.square !== false;

	// Scale
	const scale = options.scale ?? 1;

	options.prefixes?.forEach((item) => {
		let prefix: string;
		let iconSet: IconifyJSON | undefined;
		let iconsList: IconsListOption | undefined;
		let customise: ((content: string, name: string) => string) | undefined;

		// Load icon set
		if (typeof item === 'string') {
			// Prefix
			prefix = item;
			iconSet = loadIconSet(prefix);
		} else if (item.source) {
			// Source, possibly with prefix
			iconSet = loadIconSet(item.source);
			prefix = item.prefix || iconSet?.prefix;
			iconsList = item.icons;
			customise = item.customise;
			if (!prefix) {
				throw new Error(
					'Custom icon set does not have a prefix. Please set "prefix" property'
				);
			}
		} else {
			// Prefix
			prefix = item.prefix || iconSet?.prefix;
			iconSet = prefix ? loadIconSet(prefix) : undefined;
			iconsList = item.icons;
			customise = item.customise;
		}

		// Validate it
		if (!iconSet) {
			throw new Error(
				`Cannot load icon set for "${prefix}". Install "@iconify-json/${prefix}" as dev dependency?`
			);
		}
		if (!prefix) {
			throw new Error(
				'Bad icon set entry, must have either "prefix" or "source" set'
			);
		}

		// Load icons
		parseIconSet(iconSet, (name, data) => {
			// Check if icon should be rendered
			if (iconsList) {
				if (Array.isArray(iconsList)) {
					if (!iconsList.includes(name)) {
						return;
					}
				} else if (!iconsList(name)) {
					return;
				}
			}

			// Customise icon
			const body = customise
				? customise(data.body, name)
				: options.customise
				? options.customise(data.body, name, prefix)
				: data.body;

			// Generate CSS
			const iconRules = generateItemCSSRules(
				{
					...defaultIconProps,
					...data,
					body,
				},
				{
					mode: 'mask', // not used because varName is set, but required
					varName,
					forceSquare: square,
				}
			);

			// Generate selector
			const selector = iconSelector
				.replace('{prefix}', prefix)
				.replace('{name}', name);

			// Scale non-square icons
			if (!square && scale > 0 && scale !== 1 && iconRules.width) {
				iconRules.width = calculateSize(iconRules.width, scale);
			}

			// Add to rules
			rules[selector] = iconRules;
		});
	});

	// Return
	return rules;
}
