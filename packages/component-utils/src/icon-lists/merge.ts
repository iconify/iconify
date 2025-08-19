import type { IconsData } from './types.js';

/**
 * Empty split icon names data
 */
export function mergeSplitIconNames(
	data: IconsData<string[]>,
	addData: IconsData<string[]>
) {
	for (const provider in addData) {
		const addProviderData = addData[provider];
		const providerData =
			data[provider] || (data[provider] = Object.create(null));

		for (const prefix in addProviderData) {
			const prefixes = addProviderData[prefix];
			if (!providerData[prefix]?.length) {
				// Copy array
				providerData[prefix] = prefixes.slice(0);
			} else {
				// Merge arrays, removing duplicates
				providerData[prefix] = Array.from(
					new Set([...prefixes, ...providerData[prefix]])
				);
			}
		}
	}
}
