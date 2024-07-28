import type { UniversalIconLoader } from './types';
import { searchForIcon } from './modern';
import { loadCollectionFromFS } from './fs';
import { warnOnce } from './warn';
import { loadIcon } from './loader';
import { getPossibleIconNames } from './utils';

export const loadNodeIcon: UniversalIconLoader = async (
	collection,
	icon,
	options
) => {
	let result = await loadIcon(collection, icon, options);
	if (result) {
		return result;
	}

	const cwds = Array.isArray(options?.cwd) ? options.cwd : [options?.cwd];

	for (let i = 0; i < cwds.length; i++) {
		const iconSet = await loadCollectionFromFS(
			collection,
			i === cwds.length - 1 ? options?.autoInstall : false,
			undefined,
			cwds[i]
		);
		if (iconSet) {
			result = await searchForIcon(
				iconSet,
				collection,
				getPossibleIconNames(icon),
				options
			);
			if (result) {
				return result;
			}
		}
	}

	if (options?.warn) {
		warnOnce(`failed to load ${options.warn} icon`);
	}
};
