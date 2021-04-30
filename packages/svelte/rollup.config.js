import fs from 'fs';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

// Directories
const rootDir = __dirname + '/';
const targetDir = 'dist';
const sourceDir = 'src';
const libDir = 'lib';

// Create dist
try {
	fs.mkdirSync(rootDir + targetDir);
} catch (err) {}

// Copy Svelte files
['OfflineIcon.svelte'].forEach((file) => {
	fs.writeFileSync(
		rootDir + targetDir + '/' + file,
		fs.readFileSync(rootDir + sourceDir + '/' + file)
	);
	console.log('copied (original)', file);
});

// Copy compiled files (should not include anything that isn't bundled below)
['offline.js'].forEach((file) => {
	fs.writeFileSync(
		rootDir + targetDir + '/' + file,
		fs.readFileSync(rootDir + libDir + '/' + file)
	);
	console.log('copied (compiled)', file);
});

// Create bundle
export default [
	// Bundle everything
	{
		input: sourceDir + '/offline.ts',
		output: [
			{ file: targetDir + '/offline-bundle.mjs', format: 'es' },
			{ file: targetDir + '/offline-bundle.js', format: 'cjs' },
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
