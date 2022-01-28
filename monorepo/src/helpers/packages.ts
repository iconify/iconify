import type { PathList, PackageName } from './types';
import { addToPath, findSubdirs } from './dirs';

/**
 * Callback for scanPackages()
 */
export type ScanPackagesCallback = (dirs: PathList, isLink: boolean) => void;

/**
 * Scan path for packages, using callback
 */
export function scanPackages(
	path: PathList,
	callback: ScanPackagesCallback
): void {
	const subdirs = findSubdirs(path);
	Object.keys(subdirs).forEach((subdir) => {
		const isLink = subdirs[subdir];
		if (subdir.slice(0, 1) === '@' && !isLink) {
			// Namespace
			const nestedPath = addToPath(path, subdir);
			const subdirs2 = findSubdirs(nestedPath);
			Object.keys(subdirs2).forEach((subdir2) => {
				callback([subdir, subdir2], subdirs2[subdir2]);
			});
		} else {
			callback([subdir], isLink);
		}
	});
}

/**
 * Find all linked packages
 */
export function findLinkedPackages(path: PathList): PackageName[] {
	const result = [];
	scanPackages(path, (dirs, isLink) => {
		if (isLink) {
			result.push(dirs.join('/'));
		}
	});
	return result;
}
