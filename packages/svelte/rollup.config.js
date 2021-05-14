import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

// Directories
const targetDir = 'dist';
const sourceDir = 'src';

// Create bundle
export default [
	// Bundle everything
	{
		input: sourceDir + '/Icon.svelte',
		output: [
			{ file: targetDir + '/index.mjs', format: 'es' },
			{ file: targetDir + '/index.js', format: 'cjs' },
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
	{
		input: sourceDir + '/OfflineIcon.svelte',
		output: [
			{ file: targetDir + '/offline.mjs', format: 'es' },
			{ file: targetDir + '/offline.js', format: 'cjs' },
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

	// Files included in Icon.svelte as bundle
	{
		input: sourceDir + '/functions.ts',
		output: [
			{
				file: targetDir + '/functions.js',
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
	// Files included in OfflineIcon.svelte as bundle
	{
		input: sourceDir + '/offline-functions.ts',
		output: [
			{
				file: targetDir + '/offline-functions.js',
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
