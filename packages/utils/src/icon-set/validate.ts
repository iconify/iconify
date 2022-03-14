import type { IconifyJSON, IconifyOptional } from '@iconify/types';
import { iconDefaults, matchName } from '../icon';

/**
 * Match character
 */
export const matchChar = /^[a-f0-9]+(-[a-f0-9]+)*$/;

/**
 * Validate icon
 *
 * Returns name of property that failed validation or null on success
 */
function validateIconProps(item: IconifyOptional, fix: boolean): string | null {
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

		switch (key) {
			case 'body':
			case 'parent':
				if (type !== 'string') {
					return key;
				}
				break;

			case 'hFlip':
			case 'vFlip':
			case 'hidden':
				if (type !== 'boolean') {
					if (fix) {
						delete item[attr];
					} else {
						return key;
					}
				}
				break;

			case 'width':
			case 'height':
			case 'left':
			case 'top':
			case 'rotate':
			case 'inlineHeight': // Legacy properties
			case 'inlineTop':
			case 'verticalAlign':
				if (type !== 'number') {
					if (fix) {
						delete item[attr];
					} else {
						return key;
					}
				}
				break;

			default:
				// Unknown property, make sure its not object
				if (type === 'object') {
					if (fix) {
						delete item[attr];
					} else {
						return key;
					}
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
	const fix = !!options?.fix;

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
	if (typeof options?.prefix === 'string') {
		data.prefix = options.prefix;
	} else if (
		typeof data.prefix !== 'string' ||
		!data.prefix.match(matchName)
	) {
		throw new Error('Invalid prefix');
	}

	// Set or validate provider
	if (typeof options?.provider === 'string') {
		data.provider = options.provider;
	} else if (data.provider !== void 0) {
		const value = data.provider;
		if (
			typeof value !== 'string' ||
			(value !== '' && !value.match(matchName))
		) {
			if (fix) {
				delete data.provider;
			} else {
				throw new Error('Invalid provider');
			}
		}
	}

	// Validate all icons
	const icons = data.icons;
	Object.keys(icons).forEach((name) => {
		if (!name.match(matchName)) {
			if (fix) {
				delete icons[name];
				return;
			}
			throw new Error(`Invalid icon name: "${name}"`);
		}

		const item = icons[name];
		if (
			typeof item !== 'object' ||
			item === null ||
			typeof item.body !== 'string'
		) {
			if (fix) {
				delete icons[name];
				return;
			}
			throw new Error(`Invalid icon: "${name}"`);
		}

		// Check other properties
		const key =
			typeof (item as unknown as Record<string, unknown>).parent ===
			'string'
				? 'parent'
				: validateIconProps(item, fix);
		if (key !== null) {
			if (fix) {
				delete icons[name];
				return;
			}
			throw new Error(`Invalid property "${key}" in icon "${name}"`);
		}
	});

	// Check not_found
	if (data.not_found !== void 0 && !(data.not_found instanceof Array)) {
		if (fix) {
			delete data.not_found;
		} else {
			throw new Error('Invalid not_found list');
		}
	}

	// Make sure icons list is not empty
	if (!Object.keys(data.icons).length && !data.not_found?.length) {
		throw new Error('Icon set is empty');
	}

	// Validate aliases
	if (data.aliases !== void 0) {
		if (typeof data.aliases !== 'object' || data.aliases === null) {
			if (fix) {
				delete data.aliases;
			} else {
				throw new Error('Invalid aliases list');
			}
		}
	}
	if (typeof data.aliases === 'object') {
		const aliases = data.aliases;
		const validatedAliases: Set<string> = new Set();
		const failedAliases: Set<string> = new Set();

		// eslint-disable-next-line no-inner-declarations
		function validateAlias(name: string, iteration: number): boolean {
			// Check if alias has already been validated
			if (validatedAliases.has(name)) {
				return !failedAliases.has(name);
			}

			const item = aliases[name];
			if (
				// Loop or very long chain: invalidate all aliases
				iteration > 5 ||
				// Check if value is a valid object
				typeof item !== 'object' ||
				item === null ||
				typeof item.parent !== 'string' ||
				// Check if name is valid
				!name.match(matchName)
			) {
				if (fix) {
					delete aliases[name];
					failedAliases.add(name);
					return false;
				}
				throw new Error(`Invalid icon alias: "${name}"`);
			}

			// Check if parent icon/alias exists
			const parent = item.parent;
			if (data.icons[parent] === void 0) {
				// Check for parent alias
				if (
					aliases[parent] === void 0 ||
					!validateAlias(parent, iteration + 1)
				) {
					if (fix) {
						delete aliases[name];
						failedAliases.add(name);
						return false;
					}
					throw new Error(`Missing parent icon for alias "${name}`);
				}
			}

			// Check other properties
			if (
				fix &&
				(item as unknown as Record<string, unknown>).body !== void 0
			) {
				delete (item as unknown as Record<string, unknown>).body;
			}
			const key =
				(item as unknown as Record<string, unknown>).body !== void 0
					? 'body'
					: validateIconProps(item, fix);
			if (key !== null) {
				if (fix) {
					delete aliases[name];
					failedAliases.add(name);
					return false;
				}
				throw new Error(`Invalid property "${key}" in alias "${name}"`);
			}

			validatedAliases.add(name);
			return true;
		}

		Object.keys(aliases).forEach((name) => {
			validateAlias(name, 0);
		});

		// Delete empty aliases object
		if (fix && !Object.keys(data.aliases).length) {
			delete data.aliases;
		}
	}

	// Validate all properties that can be optimised
	(Object.keys(iconDefaults) as (keyof typeof iconDefaults)[]).forEach(
		(prop) => {
			const expectedType = typeof iconDefaults[prop];
			const actualType = typeof data[prop as keyof IconifyJSON];
			if (actualType !== 'undefined' && actualType !== expectedType) {
				throw new Error(`Invalid value type for "${prop}"`);
			}
		}
	);

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
				data.icons[target] === void 0 &&
				data.aliases?.[target] === void 0
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
