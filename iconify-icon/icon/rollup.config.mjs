import { readFileSync, writeFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

// Header
const header = `/**
* (c) Iconify
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

// Update README.md
let readme = readFileSync('README.md', 'utf8');
const oldReadme = readme;
const replaceCodeLink = (search) => {
	let start = 0;
	let pos;
	while ((pos = readme.indexOf(search, start)) !== -1) {
		start = pos + search.length;
		let pos2 = readme.indexOf('/', start);
		if (pos2 === -1) {
			return;
		}
		readme =
			readme.slice(0, start) + packageJSON.version + readme.slice(pos2);
	}
};
replaceCodeLink('/code.iconify.design/iconify-icon/');
replaceCodeLink('/npm/iconify-icon@');

if (readme !== oldReadme) {
	console.log('Updatead README');
	writeFileSync('README.md', readme, 'utf8');
}

// Export configuration
const config = [];

// Full and minified
[false, true].forEach((minify) => {
	// Parse all formats
	['js', 'cjs', 'mjs'].forEach((ext) => {
		if (minify && ext !== 'js') {
			// Minify only .js files
			return;
		}

		// Get export format
		let format = ext;
		let input = 'lib/index.js';
		let exportType = 'named';
		switch (ext) {
			case 'js':
				format = 'iife';
				exportType = void 0;
				input = 'lib/script.js';
				break;

			case 'mjs':
				format = 'es';
				break;
		}

		const item = {
			input,
			output: [
				{
					file: `dist/iconify-icon${minify ? '.min' : ''}.${ext}`,
					format,
					exports: exportType,
					banner: header,
				},
			],
			plugins: [
				resolve({
					browser: true,
				}),
				replace(replacements),
			],
		};

		if (minify) {
			item.plugins.push(terser());
		}

		config.push(item);
	});
});

export default config;
