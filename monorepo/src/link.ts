import fs from 'fs';
import { dirname } from 'path';
import { addToPath, pathToString, relativePath } from './dirs';
import type { PathList } from './types';

/**
 * Create symbolic link
 */
export function createLink(from: PathList, to: PathList, unlink = true): void {
	const fromDir = pathToString(from, true);
	const targetDir = pathToString(to, true);
	if (unlink) {
		rmdir(fromDir);
	}

	// Create parent directory
	const dir = dirname(fromDir);
	try {
		fs.mkdirSync(dir, {
			recursive: true,
		});
	} catch (err) {
		//
	}

	// Create link
	console.log(
		'Creating link:',
		relativePath(fromDir),
		'->',
		relativePath(targetDir)
	);
	fs.symlinkSync(targetDir, fromDir, 'dir');
}

/**
 * Remove symbolic link
 */
export function removeLink(path: PathList, packageName: string): void {
	const dir = pathToString(addToPath(path, packageName));
	console.log('Removing link:', relativePath(dir));
	try {
		fs.unlinkSync(dir);
	} catch (err) {
		return;
	}

	// Remove parent directory if empty
	if (packageName.split('/').length === 2) {
		const parentDir = dirname(dir);
		try {
			fs.rmSync(parentDir);
		} catch (err) {
			//
		}
	}
}

/**
 * Remove directory or link if exists, recursively
 */
function rmdir(dir: string) {
	try {
		const stat = fs.lstatSync(dir);
		if (stat.isDirectory() || stat.isSymbolicLink()) {
			console.log('Removing', dir);
			fs.rmSync(dir, {
				recursive: true,
			});
		}
	} catch (err) {
		//
	}
}
