import { mount } from '@vue/test-utils';
import { Icon, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

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
	test('changing icon property', done => {
		const prefix = nextPrefix();
		const name = 'changing-prop';
		const name2 = 'changing-prop2';
		const iconName = `@${provider}:${prefix}:${name}`;
		const iconName2 = `@${provider}:${prefix}:${name2}`;

		mockAPIData({
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name]: iconData,
				},
			},
			delay: next => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toEqual(true);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks (one to handle API response, one to re-render)
				setTimeout(() => {
					setTimeout(() => {
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						wrapper.setProps({
							icon: iconName2,
						});
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
			delay: next => {
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
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
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
		const Wrapper = {
			components: { Icon },
			template: `<Icon icon="${iconName}" />`,
		};
		const wrapper = mount(Wrapper, {});

		// Should render placeholder
		expect(wrapper.html()).toEqual('<!---->');
	});

	test('changing icon property while loading', done => {
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
			delay: next => {
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
			delay: next => {
				// Should have been called asynchronously
				expect(isSync).toEqual(false);

				// Icon should not have loaded yet
				expect(iconExists(iconName2)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName2)).toEqual(true);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks (one to handle API response, one to re-render)
				setTimeout(() => {
					setTimeout(() => {
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
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
		// Render component
		const Wrapper = {
			components: { Icon },
			template: `<Icon icon="${iconName}" />`,
		};
		const wrapper = mount(Wrapper, {});

		// Should render placeholder
		expect(wrapper.html()).toEqual('<!---->');

		// Change icon name
		wrapper.setProps({
			icon: iconName2,
		});

		// Async
		isSync = false;
	});

	test('changing multiple properties', done => {
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
			delay: next => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toEqual(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toEqual(true);

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks (one to handle API response, one to re-render)
				setTimeout(() => {
					setTimeout(() => {
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Add horizontal flip and style
						wrapper.setProps({
							icon: iconName,
							hFlip: true,
							style: {
								color: 'red',
							},
						});

						// Wait for next tick
						setTimeout(() => {
							expect(
								wrapper.html().replace(/\s*\n\s*/g, '')
							).toEqual(
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="color: red;"><g transform="translate(24 0) scale(-1 1)"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></g></svg>'
							);

							done();
						}, 0);
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component with placeholder text
		const Wrapper = {
			components: { Icon },
			template: `<Icon icon="${iconName}">loading...</Icon>`,
		};
		const wrapper = mount(Wrapper, {});

		// Should render placeholder
		expect(wrapper.html()).toEqual('loading...');
	});
});
