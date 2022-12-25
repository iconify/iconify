/**
 * @jest-environment jsdom
 */
import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import Icon, { loadIcons, iconExists } from '../../dist';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering icon', () => {
	test('rendering icon after loading it', () => {
		return new Promise((fulfill, reject) => {
			const prefix = nextPrefix();
			const name = 'render-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${prefix} iconify--${provider}`;
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
			expect(iconExists(iconName)).toBe(false);

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
				expect(iconExists(iconName)).toBe(true);

				// Render component
				const component = render(Icon, {
					icon: iconName,
					onLoad: (name: string) => {
						expect(name).toBe(iconName);
						expect(onLoadCalled).toBe(false);
						onLoadCalled = true;
					},
				});
				const node = component.container.querySelector('svg')!;
				const html = (node.parentNode as HTMLDivElement).innerHTML;

				// Check HTML immediately
				expect(html).toBe(
					'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
						className +
						'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
				);

				// Make sure onLoad has been called
				expect(onLoadCalled).toBe(true);

				fulfill(true);
			});
		});
	});

	test('rendering icon before loading it', () => {
		return new Promise((fulfill, reject) => {
			const prefix = nextPrefix();
			const name = 'mock-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${prefix} iconify--${provider}`;
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
					expect(iconExists(iconName)).toBe(false);

					// onLoad should not have been called yet
					expect(onLoadCalled).toBe(false);

					// Send icon data
					next();

					// Test it again
					expect(iconExists(iconName)).toBe(true);
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toBe(false);

			// Render component
			const component = render(Icon, {
				icon: iconName,
				// Also testing simple class
				class: 'test',
				onLoad: (name: string) => {
					expect(name).toBe(iconName);
					expect(onLoadCalled).toBe(false);
					onLoadCalled = true;

					// Check component on next tick
					tick()
						.then(() => {
							const node =
								component.container.querySelector('svg')!;
							const html = (node.parentNode as HTMLDivElement)
								.innerHTML;

							// Check HTML
							expect(html).toBe(
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="test ' +
									className +
									'" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
							);

							fulfill(true);
						})
						.catch(reject);
				},
			});

			// Should render empty icon
			const html = component.container.innerHTML;
			expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');

			// onLoad should not have been called yet
			expect(onLoadCalled).toBe(false);
		});
	});

	test('missing icon', () => {
		return new Promise((fulfill, reject) => {
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
					expect(iconExists(iconName)).toBe(false);

					// Send icon data
					next();

					// Test it again
					expect(iconExists(iconName)).toBe(false);

					// Check if state was changed on next few ticks
					tick()
						.then(() => {
							const html = component.container.innerHTML;
							expect(html.replace(/<!--(.*?)-->/gm, '')).toBe(
								'<div></div>'
							);
							return tick();
						})
						.then(() => {
							const html = component.container.innerHTML;
							expect(html.replace(/<!--(.*?)-->/gm, '')).toBe(
								'<div></div>'
							);
							return tick();
						})
						.then(() => {
							const html = component.container.innerHTML;
							expect(html.replace(/<!--(.*?)-->/gm, '')).toBe(
								'<div></div>'
							);
							fulfill(true);
						})
						.catch(reject);
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toBe(false);

			// Render component
			const component = render(Icon, {
				icon: iconName,
				onLoad: () => {
					throw new Error('onLoad called for empty icon!');
				},
			});

			// Should render empty icon
			const html = component.container.innerHTML;
			expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');
		});
	});
});
