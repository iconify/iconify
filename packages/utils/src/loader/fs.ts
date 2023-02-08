import { promises as fs, Stats } from 'fs';
import { isPackageExists, resolveModule } from 'local-pkg';
import type { IconifyJSON } from '@iconify/types';
import { tryInstallPkg } from './install-pkg';
import type { AutoInstall } from './types';

const _collections: Record<string, Promise<IconifyJSON | undefined>> = {};
const isLegacyExists = isPackageExists('@iconify/json');

export async function loadCollectionFromFS(
	name: string,
	autoInstall: AutoInstall = false
): Promise<IconifyJSON | undefined> {
	if (!(await _collections[name])) {
		_collections[name] = task();
	}
	return _collections[name];

	async function task() {
		let jsonPath = resolveModule(`@iconify-json/${name}/icons.json`);
		if (!jsonPath && isLegacyExists) {
			jsonPath = resolveModule(`@iconify/json/json/${name}.json`);
		}

		if (!jsonPath && !isLegacyExists && autoInstall) {
			await tryInstallPkg(`@iconify-json/${name}`, autoInstall);
			jsonPath = resolveModule(`@iconify-json/${name}/icons.json`);
		}

		let stat: Stats | undefined;
		try {
			stat = jsonPath ? await fs.lstat(jsonPath) : undefined;
		} catch (err) {
			return undefined;
		}
		if (stat?.isFile()) {
			return JSON.parse(
				await fs.readFile(jsonPath as string, 'utf8')
			) as IconifyJSON;
		} else {
			return undefined;
		}
	}
}
