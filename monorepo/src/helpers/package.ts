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

	let data: Record<string, unknown>;
	let name: string;
	try {
		data = JSON.parse(fs.readFileSync(packageFilename, 'utf8'));
		if (
			typeof data !== 'object' ||
			!data ||
			typeof data.name !== 'string'
		) {
			return null;
		}
		name = data.name;
	} catch (err) {
		return null;
	}

	const version = typeof data.version === 'string' ? data.version : '';
	const isPrivate = version ? !!data.private : true;
	const scripts =
		typeof data.scripts === 'object' ? Object.keys(data.scripts) : [];
	return {
		name,
		private: isPrivate,
		version,
		scripts,
		path,
	};
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
