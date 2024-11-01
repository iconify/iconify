import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

// Directories
const targetDir = 'dist';
const sourceDir = 'src';

const mjsExt = '.js';
const cjsExt = '.cjs';

const resolveParams = {
	extensions: ['.ts', '.mjs', '.js', '.cjs', '.svelte'],
	dedupe: ['svelte'],
};

// Create bundle
export default [
	// Files included in Icon.svelte as bundle
	{
		input: `${sourceDir}/functions.ts`,
		output: [
			{
				file: `${targetDir}/functions${mjsExt}`,
				format: 'es',
			},
			{
				file: `${targetDir}/functions${cjsExt}`,
				format: 'cjs',
			},
		],
		plugins: [
			resolve(resolveParams),
			typescript({
				tsconfig: 'tsconfig.src.json',
				compilerOptions: {
					outDir: `./${targetDir}`,
				},
			}),
		],
	},
	// Files included in OfflineIcon.svelte as bundle
	{
		input: `${sourceDir}/offline-functions.ts`,
		output: [
			{
				file: `${targetDir}/offline-functions${mjsExt}`,
				format: 'es',
			},
			{
				file: `${targetDir}/offline-functions${cjsExt}`,
				format: 'cjs',
			},
		],
		plugins: [
			resolve(resolveParams),
			typescript({
				tsconfig: 'tsconfig.src.json',
				compilerOptions: {
					outDir: `./${targetDir}`,
				},
			}),
		],
	},
];
