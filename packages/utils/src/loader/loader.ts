import { getCustomIcon } from './custom';
import { searchForIcon } from './modern';
import { warnOnce } from './install-pkg';
import type { IconifyLoaderOptions } from './types';

export const isNode = typeof process < 'u' && typeof process.stdout < 'u'

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

	let svg = await loadNodeBuiltinIcon(collection, icon, options);

	if (svg && options) {
		const { defaultStyle, defaultClass } = options
		// additional props and iconCustomizer takes precedence
		if (defaultClass && !svg.includes(' class='))
			svg = svg.replace('<svg ', `<svg class="${defaultClass}" `)
		// additional props and iconCustomizer takes precedence
		if (defaultStyle && !svg.includes(' style='))
			svg = svg.replace('<svg ', `<svg style="${defaultStyle}" `)
	}


	return svg;
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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { loadCollectionFromFS } = await importFsModule();
	const iconSet = await loadCollectionFromFS(collection, options?.autoInstall);
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

