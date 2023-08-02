export interface SpriteEntry {
	content: string;
	rawViewBox: string;
	x: number;
	y: number;
	width: number;
	height: number;
	entry: string;
}

export interface Sprites {
	content: string;
	previous?: Pick<SpriteEntry, 'y'>;
}

export type SpriteIcons =
	| Record<string, string>
	| (() => Record<string, string>);

export interface SpriteIcon {
	name: string;
	svg: string;
}

export type AsyncSpriteIcons = AsyncIterableIterator<SpriteIcon>;

export type AsyncSpriteIconsFactory = () => AsyncSpriteIcons;
