import fs from 'fs';
import { dirname } from 'path';
import type { PathList } from './types';

export const fixDir = dirname(dirname(__dirname.replace(/\\/g, '/')));
export const rootDir = dirname(fixDir);

/**
 * Add entry to array of path elements
 */
export function addToPath(
	parentDirs: PathList,
	dir: PathList | string
): PathList {
	let result = parentDirs.slice(0);
	if (dir instanceof Array) {
		result = result.concat(dir);
	} else {
		result.push(dir);
	}
	return result;
}

/**
 * Convert array of path parts to string
 */
export function pathToString(path: PathList, absolute = true): string {
	const isAbsolute =
		path.length && (path[0] === '' || path[0].slice(0, 1) === '/' || path[0].indexOf(':') !== -1);
	return (isAbsolute ? '' : absolute ? rootDir + '/' : './') + path.join('/');
}

/**
 * Convert string to array of path parts
 */
export function stringToPath(dir: string): PathList {
	// Absolute to relative
	if (dir.slice(0, rootDir.length) === rootDir) {
		dir = dir.slice(rootDir.length + 1);
	}

	// Convert to array
	const parts = dir.split('/');

	// Remove dot at start for relative paths
	if (parts[0] === '.') {
		parts.shift();
	}
	return parts;
}

/**
 * Attempt to get relative path from absolute
 */
export function relativePath(dir: string): string {
	if (dir.slice(0, rootDir.length) === rootDir) {
		return '.' + dir.slice(rootDir.length);
	}
	return dir;
}

/**
 * Subdirs list
 */
type FindSubdirsResult = Record<string, boolean>;

/**
 * Find sub-directories
 */
export function findSubdirs(
	parentPath: PathList,
	includeLinks?: boolean
): FindSubdirsResult {
	const items: FindSubdirsResult = Object.create(null);

	try {
		const files = fs.readdirSync(pathToString(parentPath));
		files.forEach((file) => {
			const filename = pathToString(addToPath(parentPath, file));
			try {
				const stat = fs.lstatSync(filename);
				if (includeLinks !== false && stat.isSymbolicLink()) {
					items[file] = true;
				} else if (stat.isDirectory() && !includeLinks) {
					items[file] = false;
				}
			} catch (err) {
				//
			}
		});
	} catch (err) {
		//
	}
	return items;
}
