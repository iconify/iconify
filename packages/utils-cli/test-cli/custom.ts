import { createLoadCollectionFromFSAsyncIterator } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';
import defineConfig from '../lib/svg-css-sprite';

export default defineConfig({
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
});
