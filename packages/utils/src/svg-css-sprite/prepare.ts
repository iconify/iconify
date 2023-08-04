import { IconifyIconBuildResult } from '../svg/build';
import { splitSVGDefs } from '../svg/defs';
import { buildParsedSVG, parseSVGContent } from '../svg/parse';
import { SpriteEntry } from './types';

/**
 * Prepare icon for sprite
 */
export function prepareIconForSprite(
	name: string,
	data: IconifyIconBuildResult
): SpriteEntry {
	const body = data.body;
	const warn =
		// Style affects all icons in sprite, can cause conflicts
		body.includes('<style') ||
		// Animations are bugged in sprite in Safari
		body.includes('<animate') ||
		body.includes('<set');
	return {
		attributes: data.attributes,
		viewBox: data.viewBox,
		name,
		...splitSVGDefs(body),
		warn,
	};
}

/**
 * Prepare SVG for sprite
 */
export function prepareSVGForSprite(
	name: string,
	svg: string
): SpriteEntry | undefined {
	const split = parseSVGContent(svg);
	const parsed = split && buildParsedSVG(split);
	return parsed && prepareIconForSprite(name, parsed);
}
