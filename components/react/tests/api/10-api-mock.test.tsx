import { loadIcons, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { describe, test, expect } from 'vitest';

describe('Testing fake API', () => {
	test('using fake API to load icon', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();
			const name = 'mock-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: {
							body: '<g />',
						},
					},
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Load icon
			loadIcons([iconName], (loaded, missing, pending) => {
				expect(loaded).toMatchObject([
					{
						provider,
						prefix,
						name,
					},
				]);
				expect(missing).toMatchObject([]);
				expect(pending).toMatchObject([]);
				fulfill(true);
			});
		});
	});
});
