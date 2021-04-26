import React from 'react';
import { Icon, loadIcons, iconExists } from '../../lib/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering icon', () => {
	test('rendering icon after loading it', (done) => {
		const prefix = nextPrefix();
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;
		mockAPIData({
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name]: iconData,
				},
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Load icon
		loadIcons([iconName], (loaded, missing, pending) => {
			// Make sure icon has been loaded
			expect(loaded).toMatchObject([
				{
					provider,
					prefix,
					name,
				},
			]);
			expect(missing).toMatchObject([]);
			expect(pending).toMatchObject([]);
			expect(iconExists(iconName)).toEqual(true);

			// Render component
			const component = renderer.create(<Icon icon={iconName} />);
			const tree = component.toJSON();

			expect(tree).toMatchObject({
				type: 'svg',
				props: {
					'xmlns': 'http://www.w3.org/2000/svg',
					'xmlnsXlink': 'http://www.w3.org/1999/xlink',
					'aria-hidden': true,
					'role': 'img',
					'style': {},
					'dangerouslySetInnerHTML': {
						__html: iconData.body,
					},
					'width': '1em',
					'height': '1em',
					'preserveAspectRatio': 'xMidYMid meet',
					'viewBox': '0 0 ' + iconData.width + ' ' + iconData.height,
				},
				children: null,
			});

			done();
		});
	});
});
