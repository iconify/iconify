import type { PathList, PackageInfo } from './types';
import { rootDir } from './dirs';
import { addToPath, findSubdirs } from './dirs';
import { getFixPackageName, getPackageInfo } from './package';

/**
 * Workspaces cache
 */
let workspaces: PackageInfo[];

/**
 * Find workspaces
 */
export function findWorkspaces(): PackageInfo[] {
	if (!workspaces) {
		workspaces = [];

		// Get name of current package
		const fixPackageName = getFixPackageName();

		function checkWorkspace(path: PathList) {
			const info = getPackageInfo(path);
			if (info && info.name !== fixPackageName) {
				workspaces.push({
					...info,
					path,
				});
			}
		}

		function checkEntry(parentPath: PathList, parts: PathList) {
			const nextParts = parts.slice(0);
			const next = nextParts.shift();
			const subdirs =
				next === '*'
					? Object.keys(findSubdirs(parentPath, false))
					: [next];

			subdirs.forEach((subdir) => {
				const dir = addToPath(parentPath, subdir);
				if (nextParts.length) {
					checkEntry(dir, nextParts);
				} else {
					checkWorkspace(dir);
				}
			});
		}

		// Check all workspaces from lerna.json
		const rootPackageJSON = require(rootDir + '/lerna.json');
		rootPackageJSON.packages?.forEach((value: string) => {
			checkEntry([], value.split('/'));
		});
	}

	// Cache and return result
	return workspaces;
}
