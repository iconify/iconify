/* eslint-disable */
const { buildFiles } = require('@iconify/library-builder');

buildFiles({
	root: __dirname,
	source: './src',
	target: './lib',
	cleanup: true,
	updateExports: true,
})
	.then(() => {
		console.log('Done');
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
