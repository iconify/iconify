import type { SpritesConfiguration } from '../lib/svg-css-sprite';
import { createLoadCollectionFromFSAsyncIterator } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';

export default {
	sprites: {
		name: 'flat-color-icons',
		collection: createLoadCollectionFromFSAsyncIterator(
			'flat-color-icons',
			{
				include: ['about', 'accept-database'],
			}
		),
		outdir: './',
	},
} satisfies SpritesConfiguration;
