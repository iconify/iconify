import type { IconsData } from './types.js';

/**
 * Empty split icon names data
 */
export function emptySplitIconNames(data: IconsData<string[]>) {
	for (const provider in data) {
		const providerData = data[provider];
		for (const prefix in providerData) {
			providerData[prefix] = [];
		}
	}
}
