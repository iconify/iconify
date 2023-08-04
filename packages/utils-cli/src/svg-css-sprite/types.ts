import { SpriteCollection } from '@iconify/utils';

export interface SpriteConfiguration {
	name: string;
	collection: SpriteCollection | SpriteCollection[];
	outdir?: string;
	mapIconName?: (icon: string, collection?: string) => string;
}

export interface SpritesConfiguration {
	sprites: SpriteConfiguration | SpriteConfiguration[];
}
