import { readFileSync } from 'fs';
import type { IconifyJSON } from '@iconify/types';
import { getIconsCSSData } from '@iconify/utils/lib/css/icons';
import { matchIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyPluginFileOptions, IconifyPluginOptions } from './options';

const missingIconsListError =
	'TailwindCSS cannot dynamically find all used icons. Need to pass list of used icons to Iconify plugin.';

/**
 * Locate icon set
 */
function locateIconSet(
	prefix: string,
	options: IconifyPluginFileOptions
): string | undefined {
	if (options.files?.[prefix]) {
		return options.files?.[prefix];
	}
	try {
		return require.resolve(`@iconify-json/${prefix}/icons.json`);
	} catch {}
	try {
		return require.resolve(`@iconify/json/json/${prefix}.json`);
	} catch {}
}

/**
 * Load icon set
 */
function loadIconSet(
	prefix: string,
	options: IconifyPluginFileOptions
): IconifyJSON | undefined {
	const filename = locateIconSet(prefix, options);
	if (filename) {
		try {
			return JSON.parse(readFileSync(filename, 'utf8'));
		} catch {}
	}
}

/**
 * Get icon names from list
 */
function getIconNames(icons: string[] | string): Record<string, Set<string>> {
	const prefixes = Object.create(null) as Record<string, Set<string>>;

	// Add entry
	const add = (prefix: string, name: string) => {
		if (
			typeof prefix === 'string' &&
			prefix.match(matchIconName) &&
			typeof name === 'string' &&
			name.match(matchIconName)
		) {
			(prefixes[prefix] || (prefixes[prefix] = new Set())).add(name);
		}
	};

	// Comma or space separated string
	let iconNames: string[] | undefined;
	if (typeof icons === 'string') {
		iconNames = icons.split(/[\s,.]/);
	} else if (icons instanceof Array) {
		iconNames = [];
		// Split each array entry
		icons.forEach((item) => {
			item.split(/[\s,.]/).forEach((name) => iconNames.push(name));
		});
	} else {
		throw new Error(missingIconsListError);
	}

	// Parse array
	if (iconNames?.length) {
		iconNames.forEach((icon) => {
			if (!icon.trim()) {
				return;
			}

			// Attempt prefix:name split
			const nameParts = icon.split(':');
			if (nameParts.length === 2) {
				add(nameParts[0], nameParts[1]);
				return;
			}

			// Attempt icon class: .icon--{prefix}--{name}
			// with or without dot
			const classParts = icon.split('--');
			if (classParts[0].match(/^\.?icon$/)) {
				if (classParts.length === 3) {
					add(classParts[1], classParts[2]);
					return;
				}
				if (classParts.length === 2) {
					// Partial match
					return;
				}
			}

			// Throw error
			throw new Error(`Cannot resolve icon: "${icon}"`);
		});
	} else {
		throw new Error(missingIconsListError);
	}

	return prefixes;
}

/**
 * Get CSS rules for icon
 */
export function getCSSRules(
	icons: string[] | string,
	options: IconifyPluginOptions = {}
): Record<string, Record<string, string>> {
	const rules = Object.create(null) as Record<string, Record<string, string>>;

	// Get all icons
	const prefixes = getIconNames(icons);

	// Parse all icon sets
	for (const prefix in prefixes) {
		const iconSet = loadIconSet(prefix, options);
		if (!iconSet) {
			throw new Error(`Cannot load icon set for "${prefix}"`);
		}
		const generated = getIconsCSSData(
			iconSet,
			Array.from(prefixes[prefix]),
			options
		);

		const result = generated.common
			? [generated.common, ...generated.css]
			: generated.css;
		result.forEach((item) => {
			const selector =
				item.selector instanceof Array
					? item.selector.join(', ')
					: item.selector;
			rules[selector] = item.rules;
		});
	}

	return rules;
}

/**
 * Get dynamic CSS rule
 */
export function getDynamicCSSRules(
	selector: string,
	icon: string,
	options: IconifyPluginOptions = {}
): Record<string, string> {
	const nameParts = icon.split('--');
	let nameError = `Invalid icon name: "${icon}"`;
	if (nameParts.length !== 2) {
		if (nameParts.length === 1 && icon.indexOf(':') !== -1) {
			nameError += `. "{prefix}:{name}" is not supported because of Tailwind limitations, use "{prefix}--{name}" (use double dash!) instead.`;
		}
		throw new Error(nameError);
	}

	const [prefix, name] = nameParts;
	if (!prefix.match(matchIconName) || !name.match(matchIconName)) {
		throw new Error(nameError);
	}

	const iconSet = loadIconSet(prefix, options);
	if (!iconSet) {
		throw new Error(`Cannot load icon set for "${prefix}"`);
	}

	console.log('Selector:', selector);
	const generated = getIconsCSSData(iconSet, [name], {
		...options,
		// One selector
		iconSelector: selector,
		commonSelector: selector,
		overrideSelector: selector,
	});
	if (generated.css.length !== 1) {
		throw new Error(`Something went wrong generating "${icon}"`);
	}
	return {
		...(generated.common?.rules || {}),
		...generated.css[0].rules,
	};
}
