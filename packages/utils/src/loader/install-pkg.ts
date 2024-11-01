import { installPackage } from '@antfu/install-pkg';
import { sleep } from '@antfu/utils';
import { cyan } from 'kolorist';
import type { AutoInstall } from './types';
import { warnOnce } from './warn';

let pending: Promise<void> | undefined;
const tasks: Record<string, Promise<void> | undefined> = {};

export async function tryInstallPkg(
	name: string,
	autoInstall: AutoInstall
): Promise<void | undefined> {
	if (pending) {
		await pending;
	}

	if (!tasks[name]) {
		console.log(cyan(`Installing ${name}...`));
		if (typeof autoInstall === 'function') {
			tasks[name] = pending = autoInstall(name)
				.then(() => sleep(300))
				.finally(() => {
					pending = undefined;
				});
		} else {
			tasks[name] = pending = installPackage(name, {
				dev: true,
				preferOffline: true,
			})
				.then(() => sleep(300))
				.catch((e) => {
					warnOnce(`Failed to install ${name}`);
					console.error(e);
				})
				.finally(() => {
					pending = undefined;
				});
		}
	}

	return tasks[name];
}
