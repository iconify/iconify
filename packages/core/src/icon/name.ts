/**
 * Icon name
 */
export interface IconifyIconName {
	readonly prefix: string;
	readonly name: string;
}

/**
 * Expression to test part of icon name.
 */
const match = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Convert string to Icon object.
 */
export const stringToIcon = (value: string): IconifyIconName | null => {
	// Attempt to split by colon: "prefix:name"
	const colonSeparated = value.split(':');
	if (colonSeparated.length > 2) {
		return null;
	}
	if (colonSeparated.length === 2) {
		return {
			prefix: colonSeparated[0],
			name: colonSeparated[1],
		};
	}

	// Attempt to split by dash: "prefix-name"
	const dashSeparated = value.split('-');
	if (dashSeparated.length > 1) {
		return {
			prefix: dashSeparated.shift() as string,
			name: dashSeparated.join('-'),
		};
	}

	return null;
};

/**
 * Check if icon is valid.
 *
 * This function is not part of stringToIcon because validation is not needed for most code.
 */
export const validateIcon = (icon: IconifyIconName | null): boolean => {
	if (!icon) {
		return false;
	}

	return !!(icon.prefix.match(match) && icon.name.match(match));
};
