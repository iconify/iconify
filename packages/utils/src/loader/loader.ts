import { getCustomIcon } from './custom';
import type { UniversalIconLoader } from './types';
import { searchForIcon } from './modern';
import { IconifyJSON } from '@iconify/types';

const cache: Map<unknown, IconifyJSON | string> = new Map();

export const loadIcon: UniversalIconLoader = async (
	collection,
	icon,
	options
) => {
	const custom = options?.customCollections?.[collection];

	if (custom) {
		if (typeof custom === 'function') {
			const cachedResult = cache.get(custom);
			const result = cachedResult ?? (await custom(icon));
			if (result) {
				if (!cachedResult) {
					cache.set(custom, result);
				}

				if (typeof result === 'string') {
					return await getCustomIcon(
						() => result,
						collection,
						icon,
						options
					);
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
					return await searchForIcon(
						result,
						collection,
						ids,
						options
					);
				}
			}
		} else {
			return await getCustomIcon(custom, collection, icon, options);
		}
	}

	return undefined;
};
