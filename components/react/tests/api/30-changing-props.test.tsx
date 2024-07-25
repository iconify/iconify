import React from 'react';
import { Icon, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const path1 = 'M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z';
const iconData = {
	body: `<path d="${path1}" fill="currentColor"/>`,
	width: 24,
	height: 24,
};

const path2 =
	'M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z';
const iconData2 = {
	body: `<path d="${path2}" fill="currentColor"/>`,
	width: 32,
	height: 32,
};

describe('Rendering icon', () => {
	test('changing icon property', () => {
		return new Promise((resolve, reject) => {
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
				type: 'icons',
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

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						const html = renderResult.container.innerHTML;
						if (html.includes('<span')) {
							// Not rendered yet
							if (counter > 5) {
								clearInterval(timer);
								reject(new Error('Icon not rendered'));
							}
							return;
						}

						// Should be rendered: test it
						clearInterval(timer);

						expect(html).toContain(path1);

						// onLoad should have been called
						expect(onLoadCalled).toEqual(iconName);

						// Change property
						renderResult.rerender(
							<Icon icon={iconName2} onLoad={onLoad} />
						);
					});
				},
			});

			mockAPIData({
				type: 'icons',
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

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						const html = renderResult.container.innerHTML;
						if (html.includes('<span')) {
							// Not rendered yet
							if (counter > 5) {
								clearInterval(timer);
								reject(new Error('Icon was not updated'));
							}
							return;
						}

						// Should be rendered: test it
						clearInterval(timer);

						expect(html).toContain(path2);

						// onLoad should have been called for second icon
						expect(onLoadCalled).toEqual(iconName2);

						resolve(true);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			const renderResult = render(
				<Icon icon={iconName} onLoad={onLoad} />
			);

			// Should render placeholder
			expect(renderResult.container.innerHTML).toEqual('<span></span>');

			// onLoad should not have been called yet
			expect(onLoadCalled).toEqual('');
		});
	});

	test('changing icon property while loading', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'changing-prop';
			const name2 = 'changing-prop2';
			const iconName = `@${provider}:${prefix}:${name}`;
			const iconName2 = `@${provider}:${prefix}:${name2}`;
			let isSync = true;

			mockAPIData({
				type: 'icons',
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
				type: 'icons',
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

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						const html = renderResult.container.innerHTML;
						if (html.includes('<span')) {
							// Not rendered yet
							if (counter > 5) {
								clearInterval(timer);
								reject(new Error('Icon not rendered'));
							}
							return;
						}

						// Should be rendered: test it
						clearInterval(timer);

						expect(html).toContain(path2);

						resolve(true);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			const renderResult = render(<Icon icon={iconName} />);

			// Should render placeholder
			expect(renderResult.container.innerHTML).toEqual('<span></span>');

			// Change icon name
			renderResult.rerender(<Icon icon={iconName2} />);

			// Async
			isSync = false;
		});
	});

	test('changing multiple properties', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'multiple-props';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${prefix} iconify--${provider}`;

			mockAPIData({
				type: 'icons',
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

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						const html = renderResult.container.innerHTML;
						if (!html.includes('<svg')) {
							// Not rendered yet
							if (counter > 5) {
								clearInterval(timer);
								reject(new Error('Icon not rendered'));
							}
							return;
						}

						// Should be rendered: test it
						clearInterval(timer);

						expect(html).toContain(path1);
						expect(html).not.toContain(
							`<g transform="translate(${iconData.width} 0) scale(-1 1)">`
						);
						expect(html).not.toContain('style="color: red;"');

						// Add horizontal flip and style
						renderResult.rerender(
							<Icon
								icon={iconName}
								hFlip={true}
								style={{ color: 'red' }}
							/>
						);

						// Should be updated immediately
						expect(renderResult.container.innerHTML).toContain(
							`<g transform="translate(${iconData.width} 0) scale(-1 1)">`
						);
						expect(renderResult.container.innerHTML).toContain(
							'style="color: red;"'
						);

						resolve(true);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component with placeholder text
			const renderResult = render(
				<Icon icon={iconName}>loading...</Icon>
			);

			// Should render placeholder
			expect(renderResult.container.innerHTML).toEqual('loading...');
		});
	});
});
