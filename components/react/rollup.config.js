import resolve from '@rollup/plugin-node-resolve';

const names = ['offline', 'iconify'];

const config = [];

// Write all packages
names.forEach((name) => {
	// ES module
	config.push({
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.mjs`,
				format: 'esm',
			},
		],
		external: ['react'],
		plugins: [resolve()],
	});

	// CommonJS module
	config.push({
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.js`,
				format: 'cjs',
			},
		],
		external: ['react'],
		plugins: [resolve()],
	});
});

export default config;
