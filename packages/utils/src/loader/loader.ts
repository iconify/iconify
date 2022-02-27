import { getCustomIcon } from './custom';
import { searchForIcon } from './modern';
import { warnOnce } from './warn';
import type { IconifyLoaderOptions } from './types';

export const isNode = typeof process < 'u' && typeof process.stdout < 'u';

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

	if (!isNode) {
		return undefined;
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
): Promise<string | undefined> {
	let result: string | undefined;
	const loadCollectionFromFS = await importFsModule().then(i => i?.loadCollectionFromFS);
	if (loadCollectionFromFS) {
		const iconSet = await loadCollectionFromFS(collection, options?.autoInstall);
		if (iconSet) {
			// possible icon names
			const ids = [
				icon,
				icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
				icon.replace(/([a-z])(\d+)/g, '$1-$2'),
			];
			result = await searchForIcon(iconSet, collection, ids, options);
		}

	}

	if (!result && options?.warn) {
		warnOnce(`failed to load ${options.warn} icon`);
	}

	return result;
}

