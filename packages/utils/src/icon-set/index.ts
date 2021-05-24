import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import { propsToCopy, fullIcon } from '../icon';
import { mergeIconData } from '../icon/merge';

/**
 * Extract icons from icon set
 */
export function getIcons(
	data: IconifyJSON,
	icons: string[],
	not_found?: boolean
): IconifyJSON | null {
	const result: IconifyJSON = {
		prefix: data.prefix,
		icons: Object.create(null),
	};
	const tested: Set<string> = new Set();
	let empty = true;

	function copy(name: string, iteration: number): boolean {
		if (iteration > 5 || tested.has(name)) {
			// Already copied or too much nesting
			return true;
		}
		tested.add(name);

		// Check for icon
		if (data.icons[name] !== void 0) {
			empty = false;
			result.icons[name] = { ...data.icons[name] };
			return true;
		}

		// Check for alias
		if (data.aliases?.[name] !== void 0) {
			const copied = copy(data.aliases[name].parent, iteration + 1);
			if (copied) {
				if (result.aliases === void 0) {
					result.aliases = Object.create(null);
				}
				result.aliases![name] = { ...data.aliases[name] };
			}
			return copied;
		}

		// Check for character, return as alias
		if (data.chars?.[name] !== void 0) {
			const parent = data.chars?.[name];
			const copied = copy(parent, iteration + 1);
			if (copied) {
				if (result.aliases === void 0) {
					result.aliases = Object.create(null);
				}
				result.aliases![name] = {
					parent,
				};
			}
			return copied;
		}

		// Not found
		return false;
	}

	// Copy common properties
	propsToCopy.forEach((attr) => {
		if (data[attr] !== void 0) {
			(result as unknown as Record<string, unknown>)[attr] = data[attr];
		}
	});

	// Copy all icons
	icons.forEach((name) => {
		if (!copy(name, 0) && not_found === true) {
			if (result.not_found === void 0) {
				result.not_found = [];
			}
			result.not_found.push(name);
		}
	});

	return empty && not_found !== true ? null : result;
}

/**
 * Get data for icon
 */
export function getIconData(
	data: IconifyJSON,
	name: string,
	full = false
): IconifyIcon | null {
	function getIcon(name: string, iteration: number): IconifyIcon | null {
		if (data.icons[name] !== void 0) {
			// Return icon
			return Object.assign({}, data.icons[name]);
		}

		// Check loop
		if (iteration > 5) {
			return null;
		}

		// Check if alias exists
		if (data.aliases?.[name] !== void 0) {
			const item = data.aliases?.[name];
			const result = getIcon(item.parent, iteration + 1);
			if (result) {
				mergeIconData(result, item);
			}
			return result;
		}

		// Check if character exists
		if (iteration === 0 && data.chars?.[name] !== void 0) {
			return getIcon(data.chars?.[name], iteration + 1);
		}

		return null;
	}

	const result = getIcon(name, 0);
	return result && full ? fullIcon(result) : result;
}
