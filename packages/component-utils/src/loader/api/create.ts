import { matchIconName } from '@iconify/utils';
import { fetchJSON } from '@iconify/fetch';
import type { LoaderConfig } from '../types.js';
import type { IconifyJSON } from '@iconify/types';

/**
 * Create loader for Iconify API
 */
export function createIconifyAPILoader(
	host: string | string[],
	init?: RequestInit
): LoaderConfig {
	const hosts = Array.isArray(host) ? host : [host];

	return {
		maxCount: 32,
		maxLength: 480,
		validateNames: true,
		loadIcons: async (names: string[], prefix: string) => {
			if (!matchIconName.test(prefix)) {
				// Invalid prefix
				return {
					prefix,
					icons: Object.create(null),
					not_found: names,
				};
			}

			// Get URL for API request
			const url = `/${prefix}.json?icons=${names.join(',')}`;

			// Fetch data
			return await fetchJSON<IconifyJSON>(hosts, url, init);
		},
	};
}
