/* eslint-disable */
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { build } = require('esbuild');

// Config
const sourceDir = './src';
const targetDir = './lib';

// True if CommonJS files should be built with `esbuild`
// If false, CommonJS files will be built with `tsc` and import paths will not be rewritten
const rebuildCommonJS = false;

/**
 * Find all TypeScript files
 */
const files = [];
findFiles('');
files.sort((a, b) => a.localeCompare(b));
function findFiles(dir) {
	fs.readdirSync(sourceDir + dir).forEach((file) => {
		if (file.slice(0, 1) === '.') {
			return;
		}

		const filename = dir + '/' + file;
		const stat = fs.lstatSync(sourceDir + filename);
		if (stat.isDirectory()) {
			findFiles(filename);
			return;
		}

		const parts = filename.split('.');
		const ext = parts.pop();
		if (ext === 'ts') {
			files.push(parts.join('.'));
		}
	});
}

/**
 * Build stuff
 */
(async () => {
	// Clean up target directory
	console.log(`Cleaning up ${targetDir}`);
	cleanDir(targetDir);

	// Build files with TypeScript compiler first to make sure there are no errors and to generate .d.ts files
	const result = child_process.spawnSync('npm', ['run', 'build:dts'], {
		cwd: __dirname,
		stdio: 'inherit',
	});
	if (result.status !== 0) {
		process.exit(result.status);
	}

	// Transpile all files to .js and .mjs
	const maxMode = rebuildCommonJS ? 2 : 1;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		for (let j = 0; j < maxMode; j++) {
			const esm = j === 0;
			const ext = esm ? '.mjs' : '.js';

			function testFile(dir, file) {
				try {
					const stat = fs.lstatSync(path.resolve(dir, file));
					if (stat.isFile()) {
						return 'file';
					}
					if (stat.isDirectory()) {
						return 'dir';
					}
				} catch (err) {
					//
				}
				return null;
			}

			function returnFile(filename) {
				const parts = filename.split('.');
				parts.pop();
				const file = parts.join('.') + ext;
				return { path: file, external: true };
			}

			console.log('Building', file.slice(1) + ext);
			await build({
				entryPoints: [sourceDir + file + '.ts'],
				outfile: targetDir + file + ext,
				format: esm ? 'esm' : 'cjs',
				bundle: true,
				plugins: [
					{
						name: 'resolve-path',
						setup(build) {
							build.onResolve({ filter: /.*/ }, (args) => {
								if (
									args.importer &&
									args.kind === 'import-statement' &&
									args.namespace === 'file'
								) {
									const importPath = args.path;
									if (importPath.slice(0, 1) !== '.') {
										return;
									}

									const dir = args.resolveDir;

									// Check if file exists as is
									const mainResult = testFile(
										dir,
										importPath
									);
									if (mainResult === 'file') {
										return returnFile(importPath);
									}

									// Attempt to add extension
									const fileWithExt = importPath + '.ts';
									if (testFile(dir, fileWithExt) === 'file') {
										return returnFile(fileWithExt);
									}

									// Check if its a directory
									if (mainResult === 'dir') {
										// Test '/index.js'
										const testing =
											importPath +
											(importPath.slice(-1) === '/'
												? ''
												: '/') +
											'index.ts';
										if (testFile(dir, testing) === 'file') {
											return returnFile(testing);
										}
									}

									console.log(args);
									throw new Error(
										`Cannot resolve ${importPath}`
									);
								}
							});
						},
					},
				],
			});
		}
	}

	// Update exports in package.json
	updatePackage();
})();

/**
 * Update exports in package.json
 */
function updatePackage() {
	const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));

	// Add './' to export
	function formatExport(path) {
		return path.slice(0, 2) === './' ? path : './' + path;
	}

	// Get all exports
	const data = {};
	if (packageData.main && packageData.module) {
		data['./'] = {
			require: formatExport(packageData.main),
			import: formatExport(packageData.module),
		};
	}
	files.forEach((file) => {
		const key = formatExport(targetDir + file);

		// Check for '/index'
		const parts = key.split('/');
		if (parts.pop() === 'index') {
			data[parts.join('/') + '/'] = {
				require: key + '.js',
				import: key + '.mjs',
			};
		}

		// Add file
		data[key] = {
			require: key + '.js',
			import: key + '.mjs',
		};
	});

	// Update package.json
	if (
		packageData['exports'] &&
		JSON.stringify(packageData['exports']) === JSON.stringify(data)
	) {
		// Nothing to update
		return;
	}

	packageData.exports = data;
	const content = JSON.stringify(packageData, null, '\t') + '\n';
	fs.writeFileSync('package.json', content, 'utf8');
	console.log('Updated exports in package.json');
}

/**
 * Remove all files from directory
 */
function cleanDir(dir) {
	let files;
	try {
		files = fs.readdirSync(dir);
	} catch (err) {
		return;
	}

	files.forEach((file) => {
		const filename = dir + '/' + file;
		let stat;
		try {
			stat = fs.lstatSync(filename);
		} catch (err) {
			return;
		}

		if (stat.isDirectory()) {
			cleanDir(filename);
			try {
				fs.rmdirSync(filename);
			} catch (err) {
				//
			}
			return;
		}

		try {
			fs.unlinkSync(filename);
		} catch (err) {
			//
		}
	});
}
