import type { IconifyIcon } from '@iconify/types';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';

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
				...defaultIconProps,
				...obj,
			};
		}
	} catch (err) {
		//
	}
}
