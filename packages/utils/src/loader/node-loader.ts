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

	const iconSet = await loadCollectionFromFS(
		collection,
		options?.autoInstall
	);
	if (iconSet) {
		result = await searchForIcon(
			iconSet,
			collection,
			getPossibleIconNames(icon),
			options
		);
	}

	if (!result && options?.warn) {
		warnOnce(`failed to load ${options.warn} icon`);
	}

	return result;
};
