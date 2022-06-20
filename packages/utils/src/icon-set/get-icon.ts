import type { ExtendedIconifyIcon, IconifyJSON } from '@iconify/types';
import { defaultIconProps, FullExtendedIconifyIcon } from '../icon/defaults';
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
): FullExtendedIconifyIcon;
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[],
	full: false
): ExtendedIconifyIcon;
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[],
	full: boolean
): FullExtendedIconifyIcon | ExtendedIconifyIcon {
	const icons = data.icons;
	const aliases = data.aliases || {};

	let currentProps = {} as ExtendedIconifyIcon;

	// Parse parent item
	function parse(name: string) {
		currentProps = mergeIconData(
			icons[name] || aliases[name],
			currentProps
		);
	}

	parse(name);
	tree.forEach(parse);

	// Add default values
	currentProps = mergeIconData(
		data,
		currentProps
	) as unknown as ExtendedIconifyIcon;

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
): FullExtendedIconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full: false
): ExtendedIconifyIcon | null;
export function getIconData(
	data: IconifyJSON,
	name: string,
	full = false
): FullExtendedIconifyIcon | ExtendedIconifyIcon | null {
	if (data.icons[name]) {
		// Parse only icon
		return internalGetIconData(data, name, [], full as true);
	}

	// Resolve tree
	const tree = getIconsTree(data, [name])[name];
	return tree ? internalGetIconData(data, name, tree, full as true) : null;
}
