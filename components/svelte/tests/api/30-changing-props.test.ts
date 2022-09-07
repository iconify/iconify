/**
 * @jest-environment jsdom
 */
import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import { iconExists } from '../../';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import ChangeIcon from './fixtures/ChangeIcon.svelte';
import ChangeProps from './fixtures/ChangeProps.svelte';

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

type TriggerSwap = () => void;

describe('Rendering icon', () => {
	test('changing icon property', (done) => {
		const prefix = nextPrefix();
		const name = 'changing-prop';
		const name2 = 'changing-prop2';
		const iconName = `@${provider}:${prefix}:${name}`;
		const iconName2 = `@${provider}:${prefix}:${name2}`;
		const className = `iconify iconify--${prefix} iconify--${provider}`;
		let onLoadCalled = ''; // Name of icon from last onLoad call
		let triggerSwap: TriggerSwap | undefined;

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
				// Fixture callback should have been called
				expect(typeof triggerSwap).toBe('function');

				// Icon should not have loaded yet
				expect(iconExists(iconName)).toBe(false);

				// onLoad should not have been called yet
				expect(onLoadCalled).toBe('');

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toBe(true);
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
				expect(iconExists(iconName2)).toBe(false);

				// onLoad should have been called only once for previous icon
				expect(onLoadCalled).toBe(iconName);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName2)).toBe(true);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toBe(false);

		// Render component
		const component = render(ChangeIcon, {
			icon1: iconName,
			icon2: iconName2,
			expose: (swap: TriggerSwap) => {
				triggerSwap = swap;
			},
			onLoad: (name: string) => {
				// onLoad should be called only once per icon
				switch (name) {
					// First onLoad call
					case iconName:
						expect(onLoadCalled).toBe('');

						// Wait 1 tick, then test rendered icon
						tick()
							.then(() => {
								const node =
									component.container.querySelector('svg')!;
								const html = (node.parentNode as HTMLDivElement)
									.innerHTML;

								// Check HTML
								expect(html).toBe(
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
										className +
										'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
								);

								// Change property
								triggerSwap!();
							})
							.catch(done);
						break;

					// Second onLoad call
					case iconName2:
						expect(onLoadCalled).toBe(iconName);

						// Wait 1 tick, then test rendered icon
						tick()
							.then(() => {
								const node =
									component.container.querySelector('svg')!;
								const html = (node.parentNode as HTMLDivElement)
									.innerHTML;

								// Check HTML
								expect(html).toBe(
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 32 32" class="' +
										className +
										'"><path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"></path></svg>'
								);

								done();
							})
							.catch(done);
						break;

					default:
						throw new Error(`Unexpected onLoad('${name}') call`);
				}
				onLoadCalled = name;
			},
		});

		// Should render empty icon
		const html = component.container.innerHTML;
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');

		// onLoad should not have been called yet
		expect(onLoadCalled).toBe('');
	});

	test('changing icon property while loading', (done) => {
		const prefix = nextPrefix();
		const name = 'changing-prop';
		const name2 = 'changing-prop2';
		const iconName = `@${provider}:${prefix}:${name}`;
		const iconName2 = `@${provider}:${prefix}:${name2}`;
		const className = `iconify iconify--${prefix} iconify--${provider}`;
		let onLoadCalled = ''; // Name of icon from last onLoad call
		let isSync = true;
		let triggerSwap: TriggerSwap | undefined;

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
				// Should have been called asynchronously
				expect(isSync).toBe(false);

				// Icon should not have loaded yet
				expect(iconExists(iconName)).toBe(false);

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
				expect(isSync).toBe(false);

				// Icon should not have loaded yet
				expect(iconExists(iconName2)).toBe(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName2)).toBe(true);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toBe(false);

		// Render component
		const component = render(ChangeIcon, {
			icon1: iconName,
			icon2: iconName2,
			expose: (swap: TriggerSwap) => {
				triggerSwap = swap;
			},
			onLoad: (name: string) => {
				// onLoad should be called only for second icon
				expect(name).toBe(iconName2);
				onLoadCalled = name;

				// Wait 1 tick, then test rendered icon
				tick()
					.then(() => {
						const node = component.container.querySelector('svg')!;
						const html = (node.parentNode as HTMLDivElement)
							.innerHTML;

						// Check HTML
						expect(html).toBe(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 32 32" class="' +
								className +
								'"><path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"></path></svg>'
						);

						done();
					})
					.catch(done);
			},
		});

		// Should render empty icon
		const html = component.container.innerHTML;
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');

		// Fixture callback should have been called
		expect(typeof triggerSwap).toBe('function');

		// Change property
		triggerSwap!();

		// Async
		isSync = false;

		// onLoad should not have been called yet
		expect(onLoadCalled).toBe('');
	});

	test('changing multiple properties', (done) => {
		const prefix = nextPrefix();
		const name = 'multiple-props';
		const iconName = `@${provider}:${prefix}:${name}`;
		const className = `iconify iconify--${prefix} iconify--${provider}`;
		let onLoadCalled = false;
		let triggerSwap: TriggerSwap | undefined;

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
				// Fixture callback should have been called
				expect(typeof triggerSwap).toBe('function');

				// Icon should not have loaded yet
				expect(iconExists(iconName)).toBe(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toBe(true);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toBe(false);

		// Render component
		const component = render(ChangeProps, {
			icon: iconName,
			expose: (swap: TriggerSwap) => {
				triggerSwap = swap;
			},
			onLoad: (name: string) => {
				expect(name).toBe(iconName);

				// Should be called only once
				expect(onLoadCalled).toBe(false);
				onLoadCalled = true;

				// Check if state was changed on next tick
				tick()
					.then(() => {
						const node = component.container.querySelector('svg')!;
						const html = (node.parentNode as HTMLDivElement)
							.innerHTML;

						// Check HTML
						expect(html).toBe(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
								className +
								'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Add horizontal flip and style
						triggerSwap!();

						// Wait for component to re-render
						return tick();
					})
					.then(() => {
						// Check HTML again
						const node = component.container.querySelector('svg')!;
						const html = (node.parentNode as HTMLDivElement)
							.innerHTML;

						expect(html).toBe(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
								className +
								'"><g transform="translate(24 0) scale(-1 1)"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></g></svg>'
						);

						done();
					})
					.catch(done);
			},
		});

		// Should render empty icon
		const html = component.container.innerHTML;
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');

		// onLoad should not have been called yet
		expect(onLoadCalled).toBe(false);
	});
});
