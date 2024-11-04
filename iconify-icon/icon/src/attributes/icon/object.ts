import type { IconifyIcon } from '@iconify/types';

/**
 * Test icon string
 */
export function testIconObject(value: unknown): IconifyIcon | undefined {
	try {
		const obj = typeof value === 'string' ? JSON.parse(value) : value;
		if (typeof obj.body === 'string') {
			return {
				...obj,
			};
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		//
	}
}
