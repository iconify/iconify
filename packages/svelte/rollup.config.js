import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
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
				browser: true,
				extensions: ['.ts', '.mjs', '.js', '.svelte'],
				dedupe: ['svelte'],
			}),
			typescript(),
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
				browser: true,
				extensions: ['.ts', '.mjs', '.js', '.svelte'],
				dedupe: ['svelte'],
			}),
			typescript(),
		],
	},

	// Files included in Icon.svelte as bundle
	{
		input: sourceDir + '/functions.ts',
		output: [
			{
				file: targetDir + '/functions.mjs',
				format: 'es',
			},
			{
				file: targetDir + '/functions.js',
				format: 'cjs',
			},
		],
		plugins: [
			resolve({
				extensions: ['.ts', '.mjs', '.js', '.svelte'],
				dedupe: ['svelte'],
			}),
			typescript(),
		],
	},
	// Files included in OfflineIcon.svelte as bundle
	{
		input: sourceDir + '/offline-functions.ts',
		output: [
			{
				file: targetDir + '/offline-functions.mjs',
				format: 'es',
			},
			{
				file: targetDir + '/offline-functions.js',
				format: 'cjs',
			},
		],
		plugins: [
			resolve({
				extensions: ['.ts', '.mjs', '.js', '.svelte'],
				dedupe: ['svelte'],
			}),
			typescript(),
		],
	},
];
