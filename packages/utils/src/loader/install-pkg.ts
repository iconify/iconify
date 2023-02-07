import { installPackage } from '@antfu/install-pkg';
import { sleep } from '@antfu/utils';
import { cyan } from 'kolorist';
import { warnOnce } from './warn';
import type { IconifyLoaderOptions } from './types';

let pending: Promise<void> | undefined;
const tasks: Record<string, Promise<void> | undefined> = {};

export async function tryInstallPkg(
	name: string,
	options?: IconifyLoaderOptions
): Promise<void | undefined> {
	if (pending) {
		await pending;
	}

	if (!tasks[name]) {
		// eslint-disable-next-line no-console
		console.log(cyan(`Installing ${name}...`));
		if (options?.customInstall) {
			tasks[name] = pending = options
				.customInstall(name)
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
				// eslint-disable-next-line
				.catch((e: any) => {
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
