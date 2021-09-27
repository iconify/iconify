import resolve from '@rollup/plugin-node-resolve';
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
		plugins: [
			resolve({
				browser: true,
				extensions: ['.ts', '.mjs', '.js'],
			}),
			typescript(),
		],
	},
];

export default config;
