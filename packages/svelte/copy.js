const fs = require('fs');

// Directories
const rootDir = __dirname + '/';
const distDir = 'dist';
const sourceDir = 'src';
const libDir = 'lib';

// Create lib and dist
try {
	fs.mkdirSync(rootDir + libDir);
} catch (err) {}
try {
	fs.mkdirSync(rootDir + distDir);
} catch (err) {}

// Copy Svelte files and definitions to lib
// These files are required by api-extractor, not aren't created by tsc
[
	'Icon.svelte',
	'Icon.svelte.d.ts',
	'OfflineIcon.svelte',
	'OfflineIcon.svelte.d.ts',
].forEach((file) => {
	const target = libDir + '/' + file;
	const source = sourceDir + '/' + file;
	fs.writeFileSync(rootDir + target, fs.readFileSync(rootDir + source));
	console.log('copied', source, '->', target);
});

// Copy pre-compiled files
// These files should not have imports that don't exist in all 3 directories: src, lib and dest
[
	'Icon.svelte',
	'Icon.svelte.d.ts',
	'OfflineIcon.svelte',
	'OfflineIcon.svelte.d.ts',
	'iconify.js',
	'offline.js',
].forEach((file) => {
	const target = distDir + '/' + file;
	const source = libDir + '/' + file;
	fs.writeFileSync(rootDir + target, fs.readFileSync(rootDir + source));
	console.log('copied', source, '->', target);
});
