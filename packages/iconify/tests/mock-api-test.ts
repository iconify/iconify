import { iconExists } from '@iconify/core/lib/storage/functions';
import { loadIcon } from '@iconify/core/lib/api/icons';
import { iconDefaults } from '@iconify/utils/lib/icon';
import { fakeAPI, nextPrefix, mockAPIData } from './helpers';

describe('Testing mock API', () => {
	it('Setting up API', async () => {
		// Set config
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

		// Mock data
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
		expect(iconExists(iconName)).toBe(false);

		// Load icon
		const data = await loadIcon(iconName);
		expect(data).toEqual({
			...iconDefaults,
			body: '<g />',
		});
	});
});
