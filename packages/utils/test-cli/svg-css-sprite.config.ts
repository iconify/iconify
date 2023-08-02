import { SpritesConfig } from '../lib/svg-css-sprite/types';
import { createLoadCollectionFromFSAsyncIterator } from '../lib/svg-css-sprite/create-node-sprite';

export default <SpritesConfig>{
	sprites: {
		'flat-color-icons': {
			name: 'flat-color-icons',
			collection:
				createLoadCollectionFromFSAsyncIterator('flat-color-icons'),
			outdir: './',
		},
	},
};
