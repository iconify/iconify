import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

// Write all packages
const config = [
	{
		input: 'src/iconify-icon.ts',
		output: [
			{
				file: 'addon/components/iconify-icon.js',
				format: 'esm',
			},
		],
		external: ['@glimmer/component', '@glimmer/tracking'],
		plugins: [resolve(), commonjs(), typescript()],
	},
];

export default config;
