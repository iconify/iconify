export interface SpriteEntry {
	content: string;
	rawViewBox: string;
	x: number;
	y: number;
	width: number;
	height: number;
	entry: string;
}

export interface SpritesContext {
	content: string;
	minY?: number;
}

export type SpriteIcons =
	| Record<string, string>
	| (() => Record<string, string>);

export interface SpriteIcon {
	name: string;
	svg: string;
	collection?: string;
}

export type AsyncSpriteIcons = AsyncIterableIterator<SpriteIcon>;
export type AsyncSpriteIconsFactory = () => AsyncSpriteIcons;

export type SpriteCollection =
	| SpriteIcon
	| SpriteIcon[]
	| AsyncSpriteIcons
	| AsyncSpriteIconsFactory;
