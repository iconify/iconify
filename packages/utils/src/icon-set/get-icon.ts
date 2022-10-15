import type {
	ExtendedIconifyIcon,
	IconifyAliases,
	IconifyJSON,
} from '@iconify/types';
import { mergeIconData } from '../icon/merge';
import { getIconsTree } from './tree';

/**
 * Get icon data, using prepared aliases tree
 */
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[]
): ExtendedIconifyIcon {
	const icons = data.icons;
	const aliases = data.aliases || (Object.create(null) as IconifyAliases);

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
	return mergeIconData(data, currentProps) as unknown as ExtendedIconifyIcon;
}

/**
 * Get data for icon
 */
export function getIconData(
	data: IconifyJSON,
	name: string
): ExtendedIconifyIcon | null {
	if (data.icons[name]) {
		// Parse only icon
		return internalGetIconData(data, name, []);
	}

	// Resolve tree
	const tree = getIconsTree(data, [name])[name];
	return tree ? internalGetIconData(data, name, tree) : null;
}
