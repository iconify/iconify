import fs from 'fs';
import type { PathList, PackageName, PackageInfo } from './types';
import { fixDir } from './dirs';
import { addToPath } from './dirs';
import { pathToString } from './dirs';

/**
 * Get package name
 */
export function getPackageInfo(path: PathList): PackageInfo | null {
	const packageFilename = pathToString(addToPath(path, 'package.json'));

	let name: unknown;
	let version: string;
	let isPrivate: boolean;
	try {
		const data = JSON.parse(
			fs.readFileSync(packageFilename, 'utf8')
		) as Record<string, unknown>;
		name = data.name;
		version = typeof data.version === 'string' ? data.version : '';
		isPrivate = version ? !!data.private : true;
	} catch (err) {
		return null;
	}
	return typeof name === 'string'
		? {
				name,
				private: isPrivate,
				version,
				path,
		  }
		: null;
}

/**
 * Get package name
 */
export function getPackageName(path: PathList): PackageName | null {
	const packageFilename = pathToString(addToPath(path, 'package.json'));

	let packageName: unknown;
	try {
		packageName = JSON.parse(fs.readFileSync(packageFilename, 'utf8')).name;
	} catch (err) {
		return null;
	}
	return typeof packageName === 'string' ? packageName : null;
}

/**
 * Check if package exists
 */
export function packageExists(path: PathList, name: PackageName): boolean {
	const newPath = addToPath(path, name);
	return getPackageName(newPath) !== null;
}

/**
 * Cache
 */
let fixPackageName: PackageName;

/**
 * Get package name for fix
 */
export function getFixPackageName(): PackageName {
	if (!fixPackageName) {
		// Get name of current package
		fixPackageName = getPackageName([fixDir]);
		if (fixPackageName === null) {
			throw new Error('Cannot get package name for fix');
		}
	}
	return fixPackageName;
}
