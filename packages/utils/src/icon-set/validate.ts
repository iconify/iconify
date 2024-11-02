import type {
	ExtendedIconifyIcon,
	IconifyAliases,
	IconifyJSON,
	IconifyOptional,
} from '@iconify/types';
import { defaultExtendedIconProps } from '../icon/defaults';
import { getIconsTree } from './tree';

/**
 * Match character
 */
export const matchChar = /^[a-f0-9]+(-[a-f0-9]+)*$/;

/**
 * Validate icon
 *
 * Returns name of property that failed validation or null on success
 */
function validateIconProps(
	item: IconifyOptional,
	fix: boolean,
	checkOtherProps: boolean
): string | null {
	// Check other properties
	for (const key in item) {
		const attr = key as keyof typeof item;
		const value = item[attr];
		const type = typeof value;

		if (type === 'undefined') {
			// Undefined was passed ???
			delete item[attr];
			continue;
		}

		const expectedType = typeof (
			defaultExtendedIconProps as Record<string, unknown>
		)[attr];

		if (expectedType !== 'undefined') {
			if (type !== expectedType) {
				// Invalid type
				if (fix) {
					delete item[attr];
					continue;
				}
				return attr;
			}
			continue;
		}

		// Unknown property, make sure its not object
		if (checkOtherProps && type === 'object') {
			if (fix) {
				delete item[attr];
			} else {
				return key;
			}
		}
	}

	return null;
}

export interface IconSetValidationOptions {
	// If true, validation function will attempt to fix icon set instead of throwing errors.
	fix?: boolean;

	// Values for provider and prefix. If missing, validation should add them.
	prefix?: string;
	provider?: string;
}

/**
 * Validate icon set, return it as IconifyJSON type on success, throw error on failure
 */
export function validateIconSet(
	obj: unknown,
	options?: IconSetValidationOptions
): IconifyJSON {
	const fix = !!(options && options.fix);

	// Check for object with 'icons' nested object
	if (
		typeof obj !== 'object' ||
		obj === null ||
		typeof (obj as Record<string, unknown>).icons !== 'object' ||
		!(obj as Record<string, unknown>).icons
	) {
		throw new Error('Bad icon set');
	}

	// Convert type
	const data = obj as IconifyJSON;

	// Set or validate prefix
	if (options && typeof options.prefix === 'string') {
		data.prefix = options.prefix;
	} else if (
		// Prefix must be a string and not empty
		typeof data.prefix !== 'string' ||
		!data.prefix
	) {
		throw new Error('Invalid prefix');
	}

	// Set or validate provider
	if (options && typeof options.provider === 'string') {
		data.provider = options.provider;
	} else if (data.provider !== void 0) {
		const value = data.provider;
		if (typeof value !== 'string') {
			if (fix) {
				delete data.provider;
			} else {
				throw new Error('Invalid provider');
			}
		}
	}

	// Check aliases object
	if (data.aliases !== void 0) {
		if (typeof data.aliases !== 'object' || data.aliases === null) {
			if (fix) {
				delete data.aliases;
			} else {
				throw new Error('Invalid aliases list');
			}
		}
	}

	// Validate all icons and aliases
	const tree = getIconsTree(data);
	const icons = data.icons;
	const aliases = data.aliases || (Object.create(null) as IconifyAliases);
	for (const name in tree) {
		const treeItem = tree[name];
		const isAlias = !icons[name];
		const parentObj = isAlias ? aliases : icons;

		if (!treeItem) {
			if (fix) {
				delete parentObj[name];
				continue;
			}
			throw new Error(`Invalid alias: ${name}`);
		}

		if (!name) {
			if (fix) {
				delete parentObj[name];
				continue;
			}
			throw new Error(`Invalid icon name: "${name}"`);
		}

		const item = parentObj[name];
		if (!isAlias) {
			// Check body
			if (typeof (item as ExtendedIconifyIcon).body !== 'string') {
				if (fix) {
					delete parentObj[name];
					continue;
				}
				throw new Error(`Invalid icon: "${name}"`);
			}
		}

		// Check other properties
		const requiredProp = isAlias ? 'parent' : 'body';
		const key =
			typeof (item as unknown as Record<string, unknown>)[
				requiredProp
			] !== 'string'
				? requiredProp
				: validateIconProps(item, fix, true);
		if (key !== null) {
			throw new Error(`Invalid property "${key}" in "${name}"`);
		}
	}

	// Check not_found
	if (data.not_found !== void 0 && !(data.not_found instanceof Array)) {
		if (fix) {
			delete data.not_found;
		} else {
			throw new Error('Invalid not_found list');
		}
	}

	// Make sure icons list is not empty
	if (
		!Object.keys(data.icons).length &&
		!(data.not_found && data.not_found.length)
	) {
		throw new Error('Icon set is empty');
	}

	// Remove aliases list if empty
	if (fix && !Object.keys(aliases).length) {
		delete data.aliases;
	}

	// Validate all properties that can be optimised, do not fix
	const failedOptionalProp = validateIconProps(data, false, false);
	if (failedOptionalProp) {
		throw new Error(`Invalid value type for "${failedOptionalProp}"`);
	}

	// Validate characters map
	if (data.chars !== void 0) {
		if (typeof data.chars !== 'object' || data.chars === null) {
			if (fix) {
				delete data.chars;
			} else {
				throw new Error('Invalid characters map');
			}
		}
	}

	if (typeof data.chars === 'object') {
		const chars = data.chars;
		Object.keys(chars).forEach((char) => {
			if (!matchChar.exec(char) || typeof chars[char] !== 'string') {
				if (fix) {
					delete chars[char];
					return;
				}
				throw new Error(`Invalid character "${char}"`);
			}
			const target = chars[char];
			if (
				!data.icons[target] &&
				(!data.aliases || !data.aliases[target])
			) {
				if (fix) {
					delete chars[char];
					return;
				}
				throw new Error(
					`Character "${char}" points to missing icon "${target}"`
				);
			}
		});

		// Delete empty aliases object
		if (fix && !Object.keys(data.chars).length) {
			delete data.chars;
		}
	}

	return data;
}
