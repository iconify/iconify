import { writeFileSync, mkdirSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';

const name = 'icon';

// Write main file
const text = `'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${name}.cjs.production.js')
} else {
  module.exports = require('./${name}.cjs.development.js')
}
`;

try {
	mkdirSync('dist', 0o755);
} catch (err) {}
writeFileSync(`dist/${name}.js`, text, 'utf8');

// Export configuration
const config = [
	// Module
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.esm.js`,
				format: 'esm',
			},
		],
		external: ['react', 'axios'],
		plugins: [resolve(), commonjs(), buble()],
	},
	// Dev build
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.cjs.development.js`,
				format: 'cjs',
			},
		],
		external: ['react', 'axios'],
		plugins: [resolve(), commonjs(), buble()],
	},
	// Production
	{
		input: `lib/${name}.js`,
		output: [
			{
				file: `dist/${name}.cjs.production.js`,
				format: 'cjs',
			},
		],
		external: ['react', 'axios'],
		plugins: [resolve(), commonjs(), buble(), terser()],
	},
];

export default config;
