import { SpritesConfiguration } from '@iconify/utils/lib/svg-css-sprite/types';
import { createLoadCollectionFromFSAsyncIterator } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';

export default <SpritesConfiguration>{
	sprites: {
		'flat-color-icons': {
			name: 'flat-color-icons',
			collection: createLoadCollectionFromFSAsyncIterator(
				'flat-color-icons',
				{
					include: ['about', 'accept-database'],
				}
			),
			outdir: './',
		},
	},
};
