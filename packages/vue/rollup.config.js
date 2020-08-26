import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';

const name = 'IconifyIcon';

// Export configuration
const config = [
	// ES Module
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.esm.js`,
				format: 'esm',
				exports: 'named',
			},
		],
		external: ['vue'],
		plugins: [resolve(), commonjs(), buble()],
	},
	// UMD Module
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.umd.js`,
				format: 'umd',
				name,
				exports: 'named',
				globals: {
					vue: 'Vue',
				},
			},
		],
		external: ['vue'],
		plugins: [resolve(), commonjs(), buble()],
	},
];

export default config;
