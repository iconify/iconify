import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	outDir: './lib',
	entries: [
		{
			input: 'src/svg-css-sprite/index',
			name: 'svg-css-sprite/index',
		},
		{
			input: 'src/svg-css-sprite/cli',
			name: 'svg-css-sprite/cli',
		},
	],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
	},
});
