import type { IconifyJSON } from '@iconify/types';
import { defaultIconProps } from '../icon/defaults';
import type { IconifyIcon, FullIconifyIcon } from '../icon/defaults';
import { mergeIconData } from '../icon/merge';
import { getIconsTree } from './tree';

/**
 * Get data for icon
 */
export function getIconData(
	data: IconifyJSON,
	name: string,
	full: true
): FullIconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full: false
): IconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full = false
): FullIconifyIcon | IconifyIcon | null {
	const icons = data.icons;
	const aliases = data.aliases || {};

	let currentProps = {} as IconifyIcon;

	// Parse parent item
	function parse(name: string) {
		currentProps = mergeIconData(
			icons[name] || aliases[name],
			currentProps,
			false
		);
	}

	const icon = icons[name];
	if (icon) {
		// Parse only icon
		parse(name);
	} else {
		// Resolve tree
		const tree = getIconsTree(data, [name])[name];
		if (!tree) {
			return null;
		}
		parse(name);
		tree.forEach(parse);
	}

	// Add default values
	currentProps = mergeIconData(
		data,
		currentProps,
		false
	) as unknown as IconifyIcon;

	// Return icon
	return full
		? Object.assign({}, defaultIconProps, currentProps)
		: currentProps;
}
