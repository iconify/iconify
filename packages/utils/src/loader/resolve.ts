import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'import-meta-resolve';

/**
 * Resolve path to package
 */
export async function resolvePathAsync(
	packageName: string,
	cwd: string
): Promise<string | undefined> {
	// `import.meta.resolve` works with fake cwd paths, but we want to intentionally bail if so
	if (!(await pathExists(cwd))) return;

	const parent = pathToFileURL(path.join(cwd, '_parent.mjs')).href;
	try {
		// Replace with `import.meta.resolve` when the `parent` parameter is stabilized
		const resolved = resolve(packageName, parent);
		const resolvedPath = fileURLToPath(resolved);
		// `import.meta.resolve` doesn't check file existence when it matches the `package.json`
		// "exports" field, so we need to check it manually
		if (await pathExists(resolvedPath)) {
			return resolvedPath;
		}
	} catch {
		//
	}
}

async function pathExists(path: string): Promise<boolean> {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}
