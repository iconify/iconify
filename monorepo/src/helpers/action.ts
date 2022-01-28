import { PackageInfo } from './types';
import { findWorkspaces } from './workspaces';

/**
 * Run callback for all workspaces
 */
export function runAction(
	log: string,
	callback: (workspace: PackageInfo) => void
): void {
	const workspaces = findWorkspaces();
	if (!workspaces.length) {
		throw new Error('No packages found');
	}
	console.log(`${log}...`);
	workspaces.forEach(callback);
}
