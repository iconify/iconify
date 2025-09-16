import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';

// Copy files
try {
	mkdirSync('dist/full', { recursive: true });
} catch {
	//
}
copyFileSync('src/full/Icon.svelte', 'dist/full/Icon.svelte');

try {
	mkdirSync('dist/basic', { recursive: true });
} catch {
	//
}
copyFileSync('src/basic/Icon.svelte', 'dist/basic/Icon.svelte');

// Read package.json
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Update main entries
delete pkg.main;
delete pkg.module;
pkg['svelte'] = './dist/full/Icon.svelte';

// Update exports, make sure they are last
const pkgExports = pkg.exports;
delete pkg['exports'];

// Delete entries we do not want to export, but used in .svelte files
delete pkgExports['./size'];
delete pkgExports['./full/status'];
delete pkgExports['./full/functions'];
delete pkgExports['./basic/functions'];

pkgExports['.'] = {
	svelte: './dist/full/Icon.svelte',
	types: './dist/index.d.ts',
};
pkgExports['./basic'] = {
	svelte: './dist/basic/Icon.svelte',
	types: './dist/index.d.ts',
};
pkgExports['./full/Icon.svelte'] = {
	svelte: './dist/full/Icon.svelte',
	types: './dist/index.d.ts',
};
pkgExports['./basic/Icon.svelte'] = {
	svelte: './dist/basic/Icon.svelte',
	types: './dist/index.d.ts',
};
pkg['exports'] = pkgExports;

// Write package.json
writeFileSync('package.json', JSON.stringify(pkg, null, '\t') + '\n', 'utf8');
