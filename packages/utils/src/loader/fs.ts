import { promises as fs, Stats } from 'fs';
import { importModule } from 'local-pkg';
import type { IconifyJSON } from '@iconify/types';
import { tryInstallPkg } from './install-pkg';
import type { AutoInstall } from './types';
import { resolvePath } from 'mlly';

// Cache: [cwd][name] => icon set promise
type CachedItem = Promise<IconifyJSON | undefined>;
type CachedItems = Record<string, CachedItem>;
const _collections = Object.create(null) as Record<string, CachedItems>;

// Check if full package exists, per cwd value
const isLegacyExists = Object.create(null) as Record<string, boolean>;

/**
 * Asynchronously loads a collection from the file system.
 *
 * @param name {string} the name of the collection, e.g. 'mdi'
 * @param autoInstall {AutoInstall} [autoInstall=false] - whether to automatically install
 * @param scope {string} [scope='@iconify-json'] - the scope of the collection, e.g. '@my-company-json'
 * @return {Promise<IconifyJSON | undefined>} the loaded IconifyJSON or undefined
 */
export async function loadCollectionFromFS(
	name: string,
	autoInstall: AutoInstall = false,
	scope = '@iconify-json',
	cwd = process.cwd()
): Promise<IconifyJSON | undefined> {
	const cache =
		_collections[cwd] ||
		(_collections[cwd] = Object.create(null) as CachedItems);

	if (!(await cache[name])) {
		cache[name] = task();
	}
	return cache[name];

	async function task() {
		const packageName = scope.length === 0 ? name : `${scope}/${name}`;
		let jsonPath = await resolvePath(`${packageName}/icons.json`, {
			url: cwd,
		}).catch(() => undefined);

		// Legacy support for @iconify/json
		if (scope === '@iconify-json') {
			// Check legacy package exists
			if (isLegacyExists[cwd] === undefined) {
				const testResult = await resolvePath(
					`@iconify/json/collections.json`,
					{
						url: cwd,
					}
				).catch(() => undefined);
				isLegacyExists[cwd] = !!testResult;
			}
			const checkLegacy = isLegacyExists[cwd];

			// Check legacy package
			if (!jsonPath && checkLegacy) {
				jsonPath = await resolvePath(
					`@iconify/json/json/${name}.json`,
					{
						url: cwd,
					}
				).catch(() => undefined);
			}

			// Try to install the package if it doesn't exist
			if (!jsonPath && !checkLegacy && autoInstall) {
				await tryInstallPkg(packageName, autoInstall);
				jsonPath = await resolvePath(`${packageName}/icons.json`, {
					url: cwd,
				}).catch(() => undefined);
			}
		} else if (!jsonPath && autoInstall) {
			await tryInstallPkg(packageName, autoInstall);
			jsonPath = await resolvePath(`${packageName}/icons.json`, {
				url: cwd,
			}).catch(() => undefined);
		}

		// Try to import module if it exists
		if (!jsonPath) {
			let packagePath = await resolvePath(packageName, {
				url: cwd,
			}).catch(() => undefined);
			if (packagePath?.match(/^[a-z]:/i)) {
				packagePath = `file:///${packagePath}`.replace(/\\/g, '/');
			}
			if (packagePath) {
				const { icons }: { icons?: IconifyJSON } = await importModule(
					packagePath
				);
				if (icons) return icons;
			}
		}

		// Load from file
		let stat: Stats | undefined;
		try {
			stat = jsonPath ? await fs.lstat(jsonPath) : undefined;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
