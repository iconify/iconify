import { readFileSync, writeFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

// Header
const header = `/**
* (c) Iconify for Tailwind CSS
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version __iconify_version__
*/`;

// Get replacements
const replacements = {
	preventAssignment: true,
};
const packageJSON = JSON.parse(readFileSync('package.json', 'utf8'));
replacements['__iconify_version__'] = packageJSON.version;

// Export configuration
const config = {
	input: 'lib/plugin.js',
	output: [
		{
			file: 'dist/plugin.js',
			format: 'cjs',
			banner: header,
		},
	],
	external: ['tailwindcss/plugin'],
	plugins: [
		resolve({
			browser: true,
		}),
		replace(replacements),
	],
};

export default config;
