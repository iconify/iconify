import { SpriteCollections } from '@iconify/utils';

export interface SpriteConfiguration {
	name: string;
	collection: SpriteCollections;
	outdir?: string;
	mapIconName?: (icon: string, collection?: string) => string;
}

export interface SpritesConfiguration {
	sprites: SpriteConfiguration | SpriteConfiguration[];
}
