import fs from 'fs';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';
import pkg from './package.json';

// Copy Icon.svelte
try {
	fs.mkdirSync(__dirname + '/dist');
} catch (err) {}
['Icon.svelte'].forEach((file) => {
	fs.writeFileSync(
		__dirname + '/dist/' + file,
		fs.readFileSync(__dirname + '/src/' + file)
	);
});

// Create component.mjs
fs.writeFileSync(
	__dirname + '/dist/component.mjs',
	fs.readFileSync(__dirname + '/src/index.ts')
);

// Create bundle
const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, (m) => m.toUpperCase())
	.replace(/-\w/g, (m) => m[1].toUpperCase());

export default [
	// Bundle everything
	{
		input: 'src/index.ts',
		output: [
			{ file: pkg.module, format: 'es' },
			{ file: pkg.main, format: 'umd', name },
		],
		plugins: [
			svelte({
				preprocess: sveltePreprocess(),
			}),
			resolve({
				extensions: ['.ts', '.js', '.svelte'],
			}),
			typescript(),
			commonjs(),
		],
	},
	// Files included in Icon.svelte as bundles without dependencies
	{
		input: 'src/generate-icon.ts',
		output: [
			{
				file: 'dist/generate-icon.js',
				format: 'es',
			},
		],
		plugins: [
			resolve({
				extensions: ['.ts', '.js', '.svelte'],
			}),
			typescript(),
			commonjs(),
		],
	},
];
