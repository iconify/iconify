/**
 * @jest-environment jsdom
 */
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { Icon, loadIcons, iconExists } from '../../';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { defaultIconResult } from '../empty';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering icon', () => {
	test('rendering icon after loading it', done => {
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
			const Wrapper = {
				components: { Icon },
				// Also test class string
				template: `<Icon icon="${iconName}" :onLoad="onLoad" class="test" />`,
				methods: {
					onLoad(name) {
						expect(name).toBe(iconName);
						expect(onLoadCalled).toBe(false);
						onLoadCalled = true;
					},
				},
			};
			const wrapper = mount(Wrapper, {});
			const html = wrapper.html().replace(/\s*\n\s*/g, '');

			// Check HTML on next tick
			Vue.nextTick(() => {
				expect(html).toBe(
					'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" class="test ' +
						className +
						'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
				);

				// Make sure onLoad has been called
				expect(onLoadCalled).toBe(true);

				done();
			});
		});
	});

	test('rendering icon before loading it', done => {
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
			delay: next => {
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
		const Wrapper = {
			components: { Icon },
			template: `<Icon icon="${iconName}" :onLoad="onLoad" :class="testClass" />`,
			methods: {
				onLoad(name) {
					expect(name).toBe(iconName);
					expect(onLoadCalled).toBe(false);
					onLoadCalled = true;

					// Test component on next tick
					Vue.nextTick(() => {
						// Check HTML
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" class="' +
								className +
								// 'foo' is appended because of weird Vue 2 behavior. Fixed in Vue 3
								' foo"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// onLoad should have been called
						expect(onLoadCalled).toBe(true);

						done();
					});
				},
			},
			data() {
				// Test dynamic class
				return {
					testClass: {
						foo: true,
						bar: false,
					},
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		// onLoad should not have been called yet
		expect(onLoadCalled).toBe(false);
	});

	test('missing icon', done => {
		const prefix = nextPrefix();
		const name = 'missing-icon';
		const iconName = `@${provider}:${prefix}:${name}`;
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: 404,
			delay: next => {
				// Icon should not have loaded yet
				expect(iconExists(iconName)).toBe(false);

				// Send icon data
				next();

				// Test it again
				expect(iconExists(iconName)).toBe(false);

				// Check if state was changed after few ticks
				Vue.nextTick(() => {
					Vue.nextTick(() => {
						Vue.nextTick(() => {
							expect(wrapper.html()).toBe(defaultIconResult);

							done();
						});
					});
				});
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toBe(false);

		// Render component
		const Wrapper = {
			components: { Icon },
			template: `<Icon icon="${iconName}" :onLoad="onLoad" />`,
			methods: {
				onLoad() {
					throw new Error('onLoad called for empty icon!');
				},
			},
		};
		const wrapper = mount(Wrapper, {});

		// Should render empty icon
		expect(wrapper.html()).toBe(defaultIconResult);
	});
});
