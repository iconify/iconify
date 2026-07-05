import type { IconifyIcon } from '@iconify/types';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { iconToSVG } from '@iconify/utils/lib/svg/build';

/**
 * Convert content to string, replacing IDs to make them unique
 */
export function renderContent(content: string | IconifyIcon): string {
	return replaceIDs(
		typeof content === 'string' ? content : iconToSVG(content).body
	);
}
