import { SpritesConfiguration } from '@iconify/utils/lib/svg-css-sprite/types';
import { createLoadCollectionFromFSAsyncIterator } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';

export default <SpritesConfiguration>{
	sprites: [
		{
			name: 'flat-color-icons-custom',
			collection: createLoadCollectionFromFSAsyncIterator(
				'flat-color-icons',
				{
					include: ['about', 'accept-database'],
				}
			),
			outdir: './',
		},
	],
};
