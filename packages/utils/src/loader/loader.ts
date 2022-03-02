import { getCustomIcon } from './custom';
import type { IconifyLoaderOptions } from './types';
import { searchForIcon } from './modern';

export const isNode = typeof process < 'u' && typeof process.stdout < 'u';

export async function loadIcon(
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions
): Promise<string | undefined> {
	const custom = options?.customCollections?.[collection];

	if (custom) {
		if (typeof custom === 'function') {
			const result = await custom(icon);
			if (result) {
				if (typeof result === 'string') {
					return await getCustomIcon(() => result as string, collection, icon, options);
				}
				// if using dynamic import and requesting the json file
				// for example: carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default as any)
				if ('icons' in result) {
					// possible icon names
					const ids = [
						icon,
						icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
						icon.replace(/([a-z])(\d+)/g, '$1-$2'),
					];
					return await searchForIcon(result, collection, ids, options)
				}
			}
		} else {
			return await getCustomIcon(custom, collection, icon, options);
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
			return require('./fs.cjs');
		}
		catch {
			return undefined;
		}
	}
}

async function importWarnModule(): Promise<typeof import('./warn') | undefined> {
	try {
		return await import('./warn');
	} catch {
		try {
			// cjs environments
			return require('./warn.cjs');
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
		const warnOnce = await importWarnModule().then(i => i?.warnOnce);
		warnOnce?.(`failed to load ${options.warn} icon`);
	}

	return result;
}

