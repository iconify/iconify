import React from 'react';
import renderer from 'react-test-renderer';
import { Icon, loadIcons, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering icon', () => {
	test('rendering icon after loading it', (done) => {
		const prefix = nextPrefix();
		const name = 'render-test';
		const iconName = `@${provider}:${prefix}:${name}`;
		let onLoadCalled = false;

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
			const component = renderer.create(
				<Icon
					icon={iconName}
					onLoad={(name) => {
						expect(name).toEqual(iconName);
						expect(onLoadCalled).toEqual(false);
						onLoadCalled = true;
					}}
				/>
			);
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

			// Make sure onLoad has been called
			expect(onLoadCalled).toEqual(true);

			done();
		});
	});

	test('rendering icon before loading it', (done) => {
		const prefix = nextPrefix();
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;
		let onLoadCalled = false;

		mockAPIData({
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name]: iconData,
				},
			},
			delay: (next) => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toEqual(false);

				// onLoad should not have been called yet
				expect(onLoadCalled).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toEqual(true);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks
				setTimeout(() => {
					setTimeout(() => {
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
								'viewBox':
									'0 0 ' +
									iconData.width +
									' ' +
									iconData.height,
							},
							children: null,
						});

						// onLoad should have been called
						expect(onLoadCalled).toEqual(true);

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = renderer.create(
			<Icon
				icon={iconName}
				onLoad={(name) => {
					expect(name).toEqual(iconName);
					expect(onLoadCalled).toEqual(false);
					onLoadCalled = true;
				}}
			/>
		);
		const tree = component.toJSON();

		// Should render placeholder
		expect(tree).toMatchObject({
			type: 'span',
			props: {},
			children: null,
		});

		// onLoad should not have been called yet
		expect(onLoadCalled).toEqual(false);
	});

	test('missing icon', (done) => {
		const prefix = nextPrefix();
		const name = 'missing-icon';
		const iconName = `@${provider}:${prefix}:${name}`;
		mockAPIData({
			provider,
			prefix,
			response: 404,
			delay: (next) => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toEqual(false);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks
				setTimeout(() => {
					setTimeout(() => {
						const tree = component.toJSON();

						expect(tree).toMatchObject({
							type: 'span',
							props: {},
							children: null,
						});

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = renderer.create(
			<Icon
				icon={iconName}
				onLoad={() => {
					throw new Error('onLoad called for empty icon!');
				}}
			></Icon>
		);
		const tree = component.toJSON();

		// Should render placeholder
		expect(tree).toMatchObject({
			type: 'span',
			props: {},
			children: null,
		});
	});
});
