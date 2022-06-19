/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { IconifyJSON } from '@iconify/types';
import { defaultIconProps } from '../icon/defaults';

/**
 * Optional properties that must be copied when copying icon set
 */
export const propsToCopy = Object.keys(defaultIconProps).concat([
	'provider',
]) as (keyof IconifyJSON)[];

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
		icons: Object.create(null) as never,
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
		const aliases = data.aliases;
		if (aliases && aliases[name] !== void 0) {
			const copied = copy(aliases[name].parent, iteration + 1);
			if (copied) {
				if (result.aliases === void 0) {
					result.aliases = Object.create(null) as never;
				}
				result.aliases[name] = { ...aliases[name] };
			}
			return copied;
		}

		// Check for character, return as alias
		const chars = data.chars;
		if (chars && chars[name] !== void 0) {
			const parent = chars[name];
			const copied = copy(parent, iteration + 1);
			if (copied) {
				if (result.aliases === void 0) {
					result.aliases = Object.create(null) as never;
				}
				result.aliases[name] = {
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
