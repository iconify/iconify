import { readFileSync, writeFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const names = ['iconify', 'iconify.without-api'];
const global = 'Iconify';

// Wrapper to export module as global and as ES module
const header = `/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt or license.gpl.txt
* files at https://github.com/iconify/iconify
*
* Licensed under Apache 2.0 or GPL 2.0 at your option.
* If derivative product is not compatible with one of licenses, you can pick one of licenses.
*
* @license Apache 2.0
* @license GPL 2.0
* @version __iconify_version__
*/`;

const footerJS = `
// Export to window or web worker
try {
	if (self.Iconify === void 0) {
		self.Iconify = Iconify;
	}
} catch (err) {
}

// Export as module
if (typeof exports === 'object') {
	try {
		exports.__esModule = true;
		exports.default = Iconify;
	} catch (err) {
	}
}`;

const footerMJS = `
// Export to window or web worker
try {
	if (self.Iconify === void 0) {
		self.Iconify = Iconify;
	}
} catch (err) {
}`;

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
replaceCodeLink('/code.iconify.design/2/');
replaceCodeLink('/@iconify/iconify@');

if (readme !== oldReadme) {
	console.log('Updatead README');
	writeFileSync('README.md', readme, 'utf8');
}

// Export configuration
const config = [];
names.forEach((name) => {
	// Full and minified
	[false, true].forEach((minify) => {
		// Parse all formats
		['js', 'cjs', 'mjs'].forEach((ext) => {
			if (minify && ext !== 'js') {
				// Minify only .js files
				return;
			}

			let format = ext;
			switch (ext) {
				case 'js':
					format = 'iife';
					break;

				case 'mjs':
					format = 'es';
			}
			const item = {
				input: `lib/${name}.js`,
				output: [
					{
						file: `dist/${name}${minify ? '.min' : ''}.${ext}`,
						format,
						name: global,
						banner: header,
						footer: ext === 'js' ? footerJS : footerMJS,
					},
				],
				plugins: [
					resolve({
						browser: true,
					}),
					replace(replacements),
				],
			};

			if (ext === 'js') {
				// Support old browsers only in .js files.
				// Other files are for modern browsers that don't need it or
				// for bundlers that should handle old browser support themselves.
				item.plugins.push(
					buble({
						objectAssign: 'Object.assign',
					})
				);
			}

			if (minify) {
				item.plugins.push(terser());
			}

			config.push(item);
		});
	});
});

export default config;
