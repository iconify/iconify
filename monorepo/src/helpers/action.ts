import { consoleLog } from './log';
import { PackageInfo } from './types';
import { filterWorkspaces } from './workspaces';

/**
 * Run callback for all workspaces
 */
export function runAction(
	log: string,
	callback: (workspace: PackageInfo) => void
): void {
	const workspaces = filterWorkspaces();
	if (!workspaces.length) {
		throw new Error('No packages found');
	}
	consoleLog(`${log}...`);
	workspaces.forEach(callback);
}
