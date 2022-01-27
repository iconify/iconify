import fs from 'fs';
import type { PackageName, PackageInfo } from './types';
import { pathToString } from './dirs';
import { addToPath } from './dirs';
import { scanPackages } from './packages';
import { findWorkspaces } from './workspaces';
import { createLink } from './link';

/**
 * Add all necessary symbolic links to workspace
 */
export function addLinksToWorkspace(workspace: PackageInfo) {
	// Get all packages
	const workspaces = findWorkspaces();

	// Create node_module if it doesn't exist
	const moduleDir = addToPath(workspace.path, 'node_modules');
	try {
		fs.mkdirSync(pathToString(moduleDir), {
			recursive: true,
		});
	} catch (err) {
		//
	}

	// Find all existing packages
	const linkedPackages: Set<PackageName> = new Set();
	const staticPackages: Set<PackageName> = new Set();
	scanPackages(moduleDir, (dirs, isLink) => {
		const packageName = dirs.join('/');
		(isLink ? linkedPackages : staticPackages).add(packageName);
	});

	// Add links to other workspaces
	workspaces.forEach((info) => {
		// Ignore current package or package with existing link
		if (
			info.private ||
			info.name === workspace.name ||
			linkedPackages.has(info.name)
		) {
			return;
		}

		// Create link
		createLink(addToPath(moduleDir, info.name), info.path);
	});
}
