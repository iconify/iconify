import { spawnSync } from 'child_process';
import { pathToString, relativePath } from './dirs';
import { PackageInfo } from './types';

let npm: string;

/**
 * Get NPM command
 */
 function getNPMCommand(): string {
	const clients = ['npm', 'npm.cmd'];
	for (let i = 0; i < clients.length; i++) {
		const cmd = clients[i];
		const result = spawnSync(cmd, ['--version']);
		if (result.status === 0) {
			return cmd;
		}
	}
	throw new Error('Cannot execute NPM commands')
}


/**
 * Run NPM command
 */
export function runNPMCommand(workspace: PackageInfo, params: string[]): void {
	if (npm === void 0) {
		npm = getNPMCommand();
	}

	const cwd = pathToString(workspace.path);
	console.log('\n' + relativePath(cwd) + ':', npm, params.join(' '));
	const result = spawnSync(npm, params, {
		cwd,
		stdio: 'inherit',
	});
	if (result.status !== 0) {
		throw new Error(
			`Failed to run "${npm} ${params.join(' ')}" at ${relativePath(cwd)}`
		);
	}
}
