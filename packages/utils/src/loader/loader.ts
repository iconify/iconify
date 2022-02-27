import { getCustomIcon } from './custom';
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

	return undefined;
}


