import type { PathList, PackageInfo } from './types';
import { rootDir } from './dirs';
import { addToPath, findSubdirs } from './dirs';
import { getFixPackageName, getPackageInfo } from './package';
import { actionOptions } from './options';

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
			if (
				info &&
				info.name !== fixPackageName &&
				!workspaces.find((item) => item.name === info.name)
			) {
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

// Cache for filterWorkspaces() result
let filteredWorkspaces: PackageInfo[];

/**
 * Get only workspaces that match options
 */
export function filterWorkspaces(): PackageInfo[] {
	if (!filteredWorkspaces) {
		filteredWorkspaces = findWorkspaces().filter((item) => {
			// Filter by `private` property
			if (
				actionOptions.private !== void 0 &&
				actionOptions.private !== 'all'
			) {
				if (item.private !== (actionOptions.private === 'private')) {
					return false;
				}
			}

			// Match workspace
			if (actionOptions.workspaces.length) {
				const workspace = item.path.join('/');
				if (actionOptions.workspaces.indexOf(workspace) === -1) {
					return false;
				}
			}

			// Match package
			if (
				actionOptions.packages.length &&
				actionOptions.packages.indexOf(item.name) === -1
			) {
				return false;
			}

			// Match
			return true;
		});
	}
	return filteredWorkspaces;
}
