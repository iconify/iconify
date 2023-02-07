import type { UniversalIconLoader } from './types';
import { searchForIcon } from './modern';
import { loadCollectionFromFS } from './fs';
import { warnOnce } from './warn';
import { loadIcon } from './loader';

export const loadNodeIcon: UniversalIconLoader = async (
	collection,
	icon,
	options
) => {
	let result = await loadIcon(collection, icon, options);
	if (result) {
		return result;
	}

	const iconSet = await loadCollectionFromFS(collection, options);
	if (iconSet) {
		// possible icon names
		const ids = [
			icon,
			icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
			icon.replace(/([a-z])(\d+)/g, '$1-$2'),
		];
		result = await searchForIcon(iconSet, collection, ids, options);
	}

	if (!result && options?.warn) {
		warnOnce(`failed to load ${options.warn} icon`);
	}

	return result;
};
