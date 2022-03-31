import fs from 'fs';
import { addToPath, pathToString, relativePath } from './dirs';
import { consoleLog } from './log';
import { PackageInfo } from './types';

/**
 * Remove node_modules
 */
export function cleanWorkspace(workspace: PackageInfo) {
	const modulesPath = addToPath(workspace.path, 'node_modules');
	const dir = pathToString(modulesPath);
	try {
		const stat = fs.lstatSync(dir);
		if (!stat.isDirectory()) {
			return;
		}
	} catch {
		return;
	}

	consoleLog('Removing:', relativePath(dir));
	try {
		fs.rmSync(dir, {
			recursive: true,
		});
	} catch (err) {
		//
	}
}
