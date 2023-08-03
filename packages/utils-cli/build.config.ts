import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	outDir: './lib',
	entries: [{ input: 'src/svg-css-sprite/cli', name: 'svg-css-sprite/cli' }],
	clean: true,
	declaration: false,
	failOnWarn: false,
	rollup: {
		emitCJS: false,
	},
});
