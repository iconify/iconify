import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
// import { terser } from 'rollup-plugin-terser';

const name = 'IconifyIcon';

// Module footer
const footer = `
// Export as ES module
if (typeof exports === 'object') {
	try {
		exports.__esModule = true;
		exports.default = ${name};
	} catch (err) {
	}
}`;

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
			},
		],
		plugins: [resolve(), commonjs(), buble()],
	},
	/*
	// Web and module
	// 	"unpkg": "dist/IconifyIcon.min.js",

	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.js`,
				name,
				format: 'iife',
				footer,
			},
		],
		plugins: [resolve(), commonjs(), buble()],
	},
	// Web
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.min.js`,
				name,
				exports: 'named',
				format: 'iife',
			},
		],
		plugins: [resolve(), commonjs(), buble(), terser()],
	},
	*/
];

export default config;
