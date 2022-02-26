import { getCustomIcon } from './custom';
import { isNode } from './utils';
import { searchForIcon } from './modern';
import { warnOnce } from './install-pkg';
import type { IconifyLoaderOptions } from './types';

export async function loadIcon(
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions
): Promise<string | undefined> {
	const custom = options?.customCollections?.[collection];

	if (custom) {
		const result = await getCustomIcon(custom, collection, icon, options);
		if (result) {
			return result;
		}
	}

	return await loadNodeBuiltinIcon(collection, icon, options);
}

async function importFsModule(): Promise<typeof import('./fs') | undefined> {
	try {
		return await import('./fs');
	} catch {
		try {
			// cjs environments
			return require('./fs.js');
		}
		catch {
			return undefined;
		}
	}
}

async function loadNodeBuiltinIcon(
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions,
	warn = true,
): Promise<string | undefined> {

	if (isNode) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { loadCollectionFromFS } = await importFsModule();
		const iconSet = loadCollectionFromFS(collection, options?.autoInstall);
		if (iconSet) {
			// possible icon names
			const ids = [
				icon,
				icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
				icon.replace(/([a-z])(\d+)/g, '$1-$2'),
			];
			return await searchForIcon(iconSet, collection, ids, options);
		}

		if (warn) {
			warnOnce(`failed to load \`@iconify-json/${collection}\`, have you installed it?`);
		}
	}
}

