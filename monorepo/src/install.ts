import { runNPMCommand } from './exec';
import { PackageInfo } from './types';
import { findWorkspaces } from './workspaces';

/**
 * Install packages
 */
export function installAllPackages(): void {
	const workspaces = findWorkspaces();
	for (let i = 0; i < workspaces.length; i++) {
		installPackages(workspaces[i]);
	}
}

/**
 * Install packages in a workspace
 */
export function installPackages(workspace: PackageInfo): void {
	runNPMCommand(workspace, ['install']);
}
