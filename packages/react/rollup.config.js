import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const names = ['offline', 'iconify'];

const config = [];

// Write all packages
names.forEach((name) => {
	// ES module
	config.push({
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.esm.js`,
				format: 'esm',
			},
		],
		external: ['react'],
		plugins: [resolve(), commonjs()],
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
		plugins: [resolve(), commonjs()],
	});
});

export default config;
