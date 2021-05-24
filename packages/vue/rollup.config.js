import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const names = ['offline', 'iconify'];
const component = 'Icon';

const config = [];

// Write all packages
names.forEach(name => {
	// ES module
	config.push({
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.mjs`,
				format: 'esm',
				exports: 'named',
			},
		],
		external: ['vue'],
		plugins: [resolve(), commonjs()],
	});

	// UMD module
	config.push({
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.js`,
				format: 'umd',
				name: component,
				exports: 'named',
				globals: {
					vue: 'Vue',
				},
			},
		],
		external: ['vue'],
		plugins: [resolve(), commonjs()],
	});
});

export default config;
