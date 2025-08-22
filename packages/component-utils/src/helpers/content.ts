import type { IconifyIcon } from '@iconify/types';
import { replaceIDs } from '@iconify/utils';
import { iconToSVG } from '@iconify/utils/lib/svg/build';

const counters = new Map<string, number>();

/**
 * Convert content to string, replacing IDs to make them unique
 */
export function renderContent(content: string | IconifyIcon): string {
	return replaceIDs(
		typeof content === 'string' ? content : iconToSVG(content).body,
		(id) => {
			const count = counters.get(id) || 0;
			counters.set(id, count + 1);
			return count ? `${id}-${count}` : id;
		}
	);
}

/**
 * Clear ID cache
 */
export function clearIDCache() {
	counters.clear();
}
