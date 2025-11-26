import { resolvePath } from 'mlly';

/**
 * Resolve path to package
 */
export async function resolvePathAsync(
	packageName: string,
	cwd: string
): Promise<string | undefined> {
	/*
	try {
		const path = import.meta.resolve(packageName);
		return path.replace('file://', '');
	} catch {
		//
	}
	*/
	try {
		return await resolvePath(packageName, { url: cwd });
	} catch {
		//
	}
}
