import type { IconifyJSON } from '@iconify/types';
import { iconDefaults, matchName } from '../icon';

/**
 * Optional properties
 */
const optionalProperties = {
	provider: 'string',
	aliases: 'object',
	not_found: 'object',
} as Record<string, string>;

for (const prop in iconDefaults) {
	optionalProperties[prop] =
		typeof iconDefaults[prop as keyof typeof iconDefaults];
}

/**
 * Validate icon set, return it as IconifyJSON on success, null on failure
 *
 * Unlike validateIconSet(), this function is very basic.
 * It does not throw exceptions, it does not check metadata, it does not fix stuff.
 */
export function quicklyValidateIconSet(obj: unknown): IconifyJSON | null {
	// Check for object with 'icons' nested object
	if (typeof obj !== 'object' || obj === null) {
		return null;
	}

	// Convert type
	const data = obj as IconifyJSON;

	// Check for prefix and icons
	if (
		typeof data.prefix !== 'string' ||
		!(obj as Record<string, unknown>).icons ||
		typeof (obj as Record<string, unknown>).icons !== 'object'
	) {
		return null;
	}

	// Check for optional properties
	for (const prop in optionalProperties) {
		if (
			(obj as Record<string, unknown>)[prop] !== void 0 &&
			typeof (obj as Record<string, unknown>)[prop] !==
				optionalProperties[prop]
		) {
			return null;
		}
	}

	// Check all icons
	const icons = data.icons;
	for (const name in icons) {
		const icon = icons[name];
		if (!name.match(matchName) || typeof icon.body !== 'string') {
			return null;
		}

		for (const prop in iconDefaults) {
			if (
				icon[prop as keyof typeof icon] !== void 0 &&
				typeof icon[prop as keyof typeof icon] !==
					typeof iconDefaults[prop as keyof typeof iconDefaults]
			) {
				return null;
			}
		}
	}

	// Check all aliases
	const aliases = data.aliases;
	if (aliases) {
		for (const name in aliases) {
			const icon = aliases[name];
			const parent = icon.parent;
			if (
				!name.match(matchName) ||
				typeof parent !== 'string' ||
				(!icons[parent] && !aliases[parent])
			) {
				return null;
			}

			for (const prop in iconDefaults) {
				if (
					icon[prop as keyof typeof icon] !== void 0 &&
					typeof icon[prop as keyof typeof icon] !==
						typeof iconDefaults[prop as keyof typeof iconDefaults]
				) {
					return null;
				}
			}
		}
	}

	return data;
}
