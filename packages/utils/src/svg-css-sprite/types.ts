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

export type SpriteIcons =
	| Record<string, string>
	| (() => Record<string, string>);

export interface SpriteIcon {
	name: string;
	svg: string;
	collection?: string;
}

export interface GeneratedUint8ArraySprite {
	name: string;
	asset: Uint8Array;
}

export type AsyncSpriteIcons = AsyncIterableIterator<SpriteIcon>;
export type AsyncSpriteIconsFactory = () => AsyncSpriteIcons;

export type SpriteCollection =
	| SpriteIcon
	| SpriteIcon[]
	| AsyncSpriteIcons
	| AsyncSpriteIconsFactory;
export type SpriteCollections = SpriteCollection | SpriteCollection[];
