import type { IconifyIcon } from '@iconify/types';
import { iconDefaults } from '@iconify/utils/lib/icon';

/**
 * Test icon string
 */
export function testIconObject(
	value: unknown
): Required<IconifyIcon> | undefined {
	try {
		const obj = typeof value === 'string' ? JSON.parse(value) : value;
		if (typeof obj.body === 'string') {
			return {
				...iconDefaults,
				...obj,
			};
		}
	} catch (err) {
		//
	}
}
