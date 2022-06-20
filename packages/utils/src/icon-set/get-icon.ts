import type { IconifyJSON } from '@iconify/types';
import { defaultIconProps } from '../icon/defaults';
import type { IconifyIcon, FullIconifyIcon } from '../icon/defaults';
import { mergeIconData } from '../icon/merge';
import { getIconsTree } from './tree';

/**
 * Get icon data, using prepared aliases tree
 */
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[],
	full: true
): FullIconifyIcon;
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[],
	full: false
): IconifyIcon;
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[],
	full: boolean
): FullIconifyIcon | IconifyIcon {
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

	parse(name);
	tree.forEach(parse);

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
	if (data.icons[name]) {
		// Parse only icon
		return internalGetIconData(data, name, [], full as true);
	}

	// Resolve tree
	const tree = getIconsTree(data, [name])[name];
	return tree ? internalGetIconData(data, name, tree, full as true) : null;
}
