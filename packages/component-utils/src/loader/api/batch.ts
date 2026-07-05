import type { QueueSplitConfig } from '../types.js';

/**
 * Split icon names into queues
 */
export function splitForBatchLoading(
	icons: string[],
	config: QueueSplitConfig
): string[][] {
	const { maxCount, maxLength } = config;

	icons.sort((a, b) => a.localeCompare(b));

	const results: string[][] = [];

	let list: string[] = [];
	let currentLength = 0;
	for (const name of icons) {
		const itemLength = name.length + 1; // +1 for separator

		if (currentLength) {
			// Check limits
			if (
				(maxLength && currentLength + itemLength > maxLength) ||
				(maxCount && list.length >= maxCount)
			) {
				// Create new list
				results.push(list);
				list = [];
				currentLength = 0;
			}
		}

		// Add item to current list
		currentLength += itemLength;
		list.push(name);
	}

	if (list.length > 0) {
		results.push(list);
	}

	return results;
}
