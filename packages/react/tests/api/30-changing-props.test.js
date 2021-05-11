import React from 'react';
import renderer from 'react-test-renderer';
import { Icon, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconData2 = {
	body: '<path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"/>',
	width: 32,
	height: 32,
};

describe('Rendering icon', () => {
	test('changing icon property', (done) => {
		const prefix = nextPrefix();
		const name = 'changing-prop';
		const name2 = 'changing-prop2';
		const iconName = `@${provider}:${prefix}:${name}`;
		const iconName2 = `@${provider}:${prefix}:${name2}`;
		let onLoadCalled = ''; // Name of icon from last onLoad call

		const onLoad = (name) => {
			// onLoad should be called only once per icon
			switch (name) {
				// First onLoad call
				case iconName:
					expect(onLoadCalled).toEqual('');
					break;

				// Second onLoad call
				case iconName2:
					expect(onLoadCalled).toEqual(iconName);
					break;

				default:
					throw new Error(`Unexpected onLoad('${name}') call`);
			}
			onLoadCalled = name;
		};

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
				expect(onLoadCalled).toEqual('');

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
						expect(onLoadCalled).toEqual(iconName);

						// Change property
						component.update(
							<Icon icon={iconName2} onLoad={onLoad} />
						);
					}, 0);
				}, 0);
			},
		});

		mockAPIData({
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name2]: iconData2,
				},
			},
			delay: (next) => {
				// Icon should not have loaded yet
				expect(iconExists(iconName2)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName2)).toEqual(true);

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
									__html: iconData2.body,
								},
								'width': '1em',
								'height': '1em',
								'preserveAspectRatio': 'xMidYMid meet',
								'viewBox':
									'0 0 ' +
									iconData2.width +
									' ' +
									iconData2.height,
							},
							children: null,
						});

						// onLoad should have been called for second icon
						expect(onLoadCalled).toEqual(iconName2);

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = renderer.create(
			<Icon icon={iconName} onLoad={onLoad} />
		);
		const tree = component.toJSON();

		// Should render placeholder
		expect(tree).toMatchObject({
			type: 'span',
			props: {},
			children: null,
		});

		// onLoad should not have been called yet
		expect(onLoadCalled).toEqual('');
	});

	test('changing icon property while loading', (done) => {
		const prefix = nextPrefix();
		const name = 'changing-prop';
		const name2 = 'changing-prop2';
		const iconName = `@${provider}:${prefix}:${name}`;
		const iconName2 = `@${provider}:${prefix}:${name2}`;
		let isSync = true;

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
				// Should have been called asynchronously, which means icon name has changed
				expect(isSync).toEqual(false);

				// Send icon data
				next();
			},
		});

		mockAPIData({
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name2]: iconData2,
				},
			},
			delay: (next) => {
				// Should have been called asynchronously
				expect(isSync).toEqual(false);

				// Icon should not have loaded yet
				expect(iconExists(iconName2)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName2)).toEqual(true);

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
									__html: iconData2.body,
								},
								'width': '1em',
								'height': '1em',
								'preserveAspectRatio': 'xMidYMid meet',
								'viewBox':
									'0 0 ' +
									iconData2.width +
									' ' +
									iconData2.height,
							},
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
		const component = renderer.create(<Icon icon={iconName} />);
		const tree = component.toJSON();

		// Should render placeholder
		expect(tree).toMatchObject({
			type: 'span',
			props: {},
			children: null,
		});

		// Change icon name
		component.update(<Icon icon={iconName2} />);

		// Async
		isSync = false;
	});

	test('changing multiple properties', (done) => {
		const prefix = nextPrefix();
		const name = 'multiple-props';
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
			delay: (next) => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toEqual(true);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks
				setTimeout(() => {
					setTimeout(() => {
						let tree = component.toJSON();
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

						// Add horizontal flip and style
						component.update(
							<Icon
								icon={iconName}
								hFlip={true}
								style={{ color: 'red' }}
							/>
						);

						tree = component.toJSON();
						expect(tree).toMatchObject({
							type: 'svg',
							props: {
								'xmlns': 'http://www.w3.org/2000/svg',
								'xmlnsXlink': 'http://www.w3.org/1999/xlink',
								'aria-hidden': true,
								'role': 'img',
								'style': {
									color: 'red',
								},
								'dangerouslySetInnerHTML': {
									__html: `<g transform="translate(${iconData.width} 0) scale(-1 1)">${iconData.body}</g>`,
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
						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component with placeholder text
		const component = renderer.create(
			<Icon icon={iconName}>loading...</Icon>
		);
		const tree = component.toJSON();

		// Should render placeholder
		expect(tree).toEqual('loading...');
	});
});
