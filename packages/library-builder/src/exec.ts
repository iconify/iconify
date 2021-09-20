import { spawn } from 'child_process';

/**
 * Execute command
 */
export function exec(
	dir: string,
	cmd: string,
	params: string[]
): Promise<number> {
	return new Promise((fulfill, reject) => {
		const result = spawn(cmd, params, {
			cwd: dir,
			stdio: 'inherit',
		});

		result.on('close', (code) => {
			if (code !== 0) {
				reject(code);
			} else {
				fulfill(0);
			}
		});
	});
}
