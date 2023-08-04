import { SpriteEntry, SpritesContext } from './types';

/**
 * Create empty context for merging sprites
 */
export function createSpritesContext(prefix = 'shapes-'): SpritesContext {
	return {
		prefix,
		defs: '',
		content: '',
		minY: 0,
		ids: new Set(),
		warned: new Set(),
	};
}

/**
 * Function to add icon to sprite
 */
export function addEntryToSpriteContext(
	context: SpritesContext,
	entry: SpriteEntry
): boolean {
	const { minY, prefix, ids } = context;
	const { name, viewBox } = entry;
	const id = prefix + name;
	const viewID = id + '-view';
	if (ids.has(name) || ids.has(id) || ids.has(viewID)) {
		// Duplicate ID
		return false;
	}
	ids.add(name).add(id).add(viewID);

	// Add symbol
	context.defs += `${entry.defs}<symbol id="${id}" viewBox="${entry.attributes.viewBox}">${entry.content}</symbol>`;

	// Add view and use
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [x, _y, width, height] = viewBox;
	context.content += `<view id="${viewID}" viewBox="${x} ${minY} ${width} ${height}"/>
    <use href="#${id}" x="${x}" y="${minY}" id="${name}"/>`;

	// Update minY
	context.minY = minY + height + 1;
	return true;
}

/**
 * Build SVG sprite from context
 */
export function exportSVGSprite(context: SpritesContext): string {
	return (
		'<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
		context.defs +
		'</defs>' +
		context.content +
		'</svg>'
	);
}
