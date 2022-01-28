import fs from 'fs';
import type { PackageName, PackageInfo } from './types';
import { pathToString } from './dirs';
import { addToPath } from './dirs';
import { scanPackages } from './packages';
import { findWorkspaces } from './workspaces';
import { removeLink } from './link';

// Cache
let packageNames: Set<PackageName>;

/**
 * Get all local packages
 */
function getLocalPackages(): Set<PackageName> {
	if (!packageNames) {
		packageNames = new Set(findWorkspaces().map((item) => item.name));
	}

	return packageNames;
}

/**
 * Remove all symbolic links from workspace
 */
export function removeLinksFromWorkspace(workspace: PackageInfo) {
	// Create node_module if it doesn't exist
	const modulesDir = addToPath(workspace.path, 'node_modules');
	try {
		fs.lstatSync(pathToString(modulesDir));
	} catch (err) {
		// Directory does not exist
		return;
	}

	// Get all packages
	const localPackages = getLocalPackages();

	// Find all existing packages
	scanPackages(modulesDir, (dirs, isLink) => {
		if (!isLink) {
			return;
		}
		const packageName = dirs.join('/');
		if (localPackages.has(packageName)) {
			removeLink(modulesDir, packageName);
		}
	});
}
