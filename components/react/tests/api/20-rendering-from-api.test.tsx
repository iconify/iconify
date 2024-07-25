import React from 'react';
import { Icon, loadIcons, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering icon', () => {
	test('rendering icon after loading it', () => {
		return new Promise((resolve) => {
			const prefix = nextPrefix();
			const name = 'render-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${provider} iconify--${prefix}`;
			let onLoadCalled = false;

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
				const renderResult = render(
					<Icon
						icon={iconName}
						onLoad={(name) => {
							expect(name).toEqual(iconName);
							expect(onLoadCalled).toEqual(false);
							onLoadCalled = true;
						}}
					/>
				);
				expect(renderResult.container.innerHTML).toEqual(
					`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="${className}" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>`
				);

				// Make sure onLoad has been called
				expect(onLoadCalled).toEqual(true);

				resolve(true);
			});
		});
	});

	test('rendering icon before loading it', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'mock-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${provider} iconify--${prefix}`;
			let onLoadCalled = false;

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
					expect(onLoadCalled).toEqual(false);

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

						expect(html).toEqual(
							`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="${className} test" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>`
						);

						// onLoad should have been called
						expect(onLoadCalled).toEqual(true);

						resolve(true);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			const renderResult = render(
				<Icon
					icon={iconName}
					className="test"
					onLoad={(name) => {
						expect(name).toEqual(iconName);
						expect(onLoadCalled).toEqual(false);
						onLoadCalled = true;
					}}
				/>
			);

			// Should render placeholder
			expect(renderResult.container.innerHTML).toEqual('<span></span>');

			// onLoad should not have been called yet
			expect(onLoadCalled).toEqual(false);
		});
	});

	test('missing icon', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'missing-icon';
			const iconName = `@${provider}:${prefix}:${name}`;
			mockAPIData({
				type: 'icons',
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

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						const html = renderResult.container.innerHTML;
						if (html.includes('<span')) {
							// Not rendered yet
							if (counter > 5) {
								// Success
								clearInterval(timer);
								resolve(true);
							}
							return;
						}

						// Content changed???
						clearInterval(timer);
						reject(
							new Error(
								'Bad icon content: ' +
									renderResult.container.innerHTML
							)
						);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			const renderResult = render(
				<Icon
					icon={iconName}
					onLoad={() => {
						throw new Error('onLoad called for empty icon!');
					}}
				></Icon>
			);

			// Should render placeholder
			expect(renderResult.container.innerHTML).toEqual('<span></span>');
		});
	});
});
