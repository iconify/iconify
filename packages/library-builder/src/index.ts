import { promises as fs } from 'fs';
import { cleanDir } from './clean';
import { runESBuild } from './esbuild';
import { exec } from './exec';
import { BuildParams, cleanupParams } from './params';
import { scanFolder } from './scan';
import { updatePackageJSON } from './update-package';

/**
 * Buld package
 */
export async function buildFiles(params: BuildParams) {
	const fullParams = cleanupParams(params);
	let { root, source, target, buildScript } = fullParams;

	// Read package.json
	let packageJSON: Record<string, unknown>;
	try {
		const content = await fs.readFile(root + 'package.json', 'utf8');
		packageJSON = JSON.parse(content);
	} catch (err) {
		throw new Error('Cannot find package.json in root directory.');
	}

	// Check for scripts
	const scripts = packageJSON.scripts as Record<string, string>;
	if (typeof scripts !== 'object') {
		throw new Error('package.json is missing scripts');
	}
	if (
		typeof buildScript === 'string' &&
		typeof scripts[buildScript] !== 'string'
	) {
		throw new Error(`Missing scripts["${buildScript}"] in package.json`);
	}

	// Clean up
	if (fullParams.cleanup) {
		await cleanDir(root + target);
	}

	// Find all files
	const files = await scanFolder(root + source);
	if (!files.length) {
		throw new Error(`Cannot find any files to parse.`);
	}
	console.log(`Found ${files.length} files to parse.`);

	// Build files with TypeScript compiler first to make sure there are no errors and to generate .d.ts files
	if (typeof buildScript === 'string') {
		await exec(root, 'npm', ['run', buildScript]);
	} else {
		await exec(root, 'tsc', ['-b']);
	}

	// Build ES modules
	await runESBuild(fullParams, files);

	// Update package.json
	if (fullParams.updateExports) {
		await updatePackageJSON(root, target, files);
	}
}
