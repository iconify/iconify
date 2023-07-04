/**
 * @jest-environment jsdom
 */
import { loadIcons, iconLoaded } from '../../dist';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

describe('Testing fake API', () => {
	test('using fake API to load icon', () => {
		return new Promise((fulfill, reject) => {
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
			expect(iconLoaded(iconName)).toBe(false);

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
