import { IconifyIconBuildResult } from '../svg/build';

export interface SpriteEntry_v1 {
	content: string;
	rawViewBox: string;
	x: number;
	y: number;
	width: number;
	height: number;
	entry: string;
}

export interface SpriteEntry extends Omit<IconifyIconBuildResult, 'body'> {
	// Body split in defs and content
	defs: string;
	content: string;

	// Name
	name: string;

	// True if icon contains code not usable in sprite
	warn: boolean;
}

export interface SpritesContext_v1 {
	content: string;
	minY?: number;
}

export interface SpritesContext {
	// Prefix for IDs
	prefix: string;

	// Definitions and content
	defs: string;
	content: string;

	// Minimum Y for next entry
	minY: number;

	// List of used IDs
	ids: Set<string>;

	// List of icons that are not usable
	warned: Set<string>;
}

/**
 * SVG Icon definition.
 *
 * The map should be a record of icon names and SVG strings.
 */
export type SpriteIcons =
	| Record<string, string>
	| (() => Record<string, string>);

/**
 * Internal representation of SVG Sprite icon.
 */
export interface SpriteIcon {
	/**
	 * The icon name.
	 */
	name: string;
	/**
	 * The SVG string.
	 */
	svg: string;
	/**
	 * The collection name.
	 */
	collection?: string;
}

/**
 * SVG Sprite icon as Uint8Array asset.
 */
export interface GeneratedUint8ArraySprite {
	/**
	 * The sprite name.
	 */
	name: string;
	/**
	 * The sprite asset.
	 */
	asset: Uint8Array;
}

export type AsyncSpriteIcons = AsyncIterableIterator<SpriteIcon>;
export type AsyncSpriteIconsFactory = () => AsyncSpriteIcons;

/**
 * CSS SVG Sprite SVG icons source.
 *
 * Each sprite can be generated from multiple sources:
 * - single icon
 * - array of icons
 * - async iterable of icons
 * - async iterable factory
 */
export type SpriteCollection =
	| SpriteIcon
	| SpriteIcon[]
	| AsyncSpriteIcons
	| AsyncSpriteIconsFactory;
export type SpriteCollections = SpriteCollection | SpriteCollection[];
