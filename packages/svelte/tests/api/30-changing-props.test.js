import { render } from '@testing-library/svelte';
import { iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import ChangeIcon from './fixtures/ChangeIcon.svelte';
import ChangeProps from './fixtures/ChangeProps.svelte';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconData2 = {
	body:
		'<path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"/>',
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
		let triggerSwap;

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
				// Fixture callback should have been called
				expect(typeof triggerSwap).toEqual('function');

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
						const node = component.container.querySelector('svg');
						const html = node.parentNode.innerHTML;

						// Check HTML
						expect(html).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Change property
						triggerSwap();
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
						const node = component.container.querySelector('svg');
						const html = node.parentNode.innerHTML;

						// Check HTML
						expect(html).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"></path></svg>'
						);

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = render(ChangeIcon, {
			icon1: iconName,
			icon2: iconName2,
			expose: (swap) => {
				triggerSwap = swap;
			},
		});

		// Should render empty icon
		const html = component.container.innerHTML;
		expect(html).toEqual('<div></div>');
	});

	test('changing multiple properties', (done) => {
		const prefix = nextPrefix();
		const name = 'multiple-props';
		const iconName = `@${provider}:${prefix}:${name}`;
		let triggerSwap;

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
				// Fixture callback should have been called
				expect(typeof triggerSwap).toEqual('function');

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
						const node = component.container.querySelector('svg');
						const html = node.parentNode.innerHTML;

						// Check HTML
						expect(html).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Add horizontal flip and style
						triggerSwap();

						// Wait for component to re-render
						setTimeout(() => {
							setTimeout(() => {
								// Check HTML again
								const node = component.container.querySelector(
									'svg'
								);
								const html = node.parentNode.innerHTML;

								expect(html).toEqual(
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></g></svg>'
								);

								done();
							}, 0);
						}, 0);
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = render(ChangeProps, {
			icon: iconName,
			expose: (swap) => {
				triggerSwap = swap;
			},
		});

		// Should render empty icon
		const html = component.container.innerHTML;
		expect(html).toEqual('<div></div>');
	});
});
