import { spawnSync } from 'child_process';
import { pathToString, relativePath } from './dirs';
import { PackageInfo } from './types';

/**
 * Run NPM command
 */
export function runNPMCommand(workspace: PackageInfo, params: string[]): void {
	const cwd = pathToString(workspace.path);
	console.log(relativePath(cwd) + ':', 'npm', params.join(' '));
	const result = spawnSync('npm', params, {
		cwd,
		stdio: 'inherit',
	});
	if (result.status !== 0) {
		throw new Error(
			`Failed to run "npm ${params.join(' ')}" at ${relativePath(cwd)}`
		);
	}
}
