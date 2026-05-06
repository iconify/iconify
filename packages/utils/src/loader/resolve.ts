import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'import-meta-resolve';

/**
 * Resolve path to package
 */
export function resolvePath(
	packageName: string,
	cwd: string
): string | undefined {
	const parent = pathToFileURL(path.join(cwd, '_base.mjs')).href;
	try {
		// Replace with `import.meta.resolve` when the `parent` parameter is stabilized
		const path = resolve(packageName, parent);
		return fileURLToPath(path);
	} catch {
		//
	}
}
