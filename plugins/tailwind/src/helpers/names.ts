import { matchIconName } from '@iconify/utils/lib/icon/name';

/**
 * Get icon names from list
 */
export function getIconNames(
	icons: string[] | string
): Record<string, Set<string>> | undefined {
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
		return;
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
		return;
	}

	return prefixes;
}
