import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Icon, loadIcons, iconLoaded, setCustomIconLoader } from '../../';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { defaultIconResult } from '../empty';

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
			expect(iconLoaded(iconName)).toEqual(false);

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
				expect(iconLoaded(iconName)).toEqual(true);

				// Render component
				const Wrapper = {
					components: { Icon },
					// Also test class string
					template: `<Icon icon="${iconName}" :onLoad="onLoad" class="test" />`,
					methods: {
						onLoad(name) {
							expect(name).toEqual(iconName);
							expect(onLoadCalled).toEqual(false);
							onLoadCalled = true;
						},
					},
				};
				const wrapper = mount(Wrapper, {});

				// Check HTML on next tick
				nextTick()
					.then(() => {
						const html = wrapper.html().replace(/\s*\n\s*/g, '');
						expect(html).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="test ' +
								className +
								'" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Make sure onLoad has been called
						expect(onLoadCalled).toEqual(true);

						fulfill(true);
					})
					.catch(reject);
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
					expect(iconLoaded(iconName)).toEqual(false);

					// onLoad should not have been called yet
					expect(onLoadCalled).toEqual(false);

					// Send icon data
					next();

					// Test it again
					expect(iconLoaded(iconName)).toEqual(true);
				},
			});

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toEqual(false);

			// Render component
			const Wrapper = {
				components: { Icon },
				template: `<Icon icon="${iconName}" :onLoad="onLoad" :class="testClass" />`,
				methods: {
					onLoad(name) {
						expect(name).toEqual(iconName);
						expect(onLoadCalled).toEqual(false);
						onLoadCalled = true;

						// Test component on next tick
						nextTick()
							.then(() => {
								// Check HTML
								expect(
									wrapper.html().replace(/\s*\n\s*/g, '')
								).toEqual(
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="foo ' +
										className +
										'" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
								);

								fulfill(true);
							})
							.catch(reject);
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
			expect(onLoadCalled).toEqual(false);
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
					expect(iconLoaded(iconName)).toEqual(false);

					// Send icon data
					next();

					// Test it again
					expect(iconLoaded(iconName)).toEqual(false);

					// Check if state was changed on next few ticks
					nextTick()
						.then(() => {
							expect(wrapper.html()).toEqual(defaultIconResult);
							return nextTick();
						})
						.then(() => {
							expect(wrapper.html()).toEqual(defaultIconResult);
							return nextTick();
						})
						.then(() => {
							expect(wrapper.html()).toEqual(defaultIconResult);
							fulfill(true);
						})
						.catch(reject);
				},
			});

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toEqual(false);

			// Render component
			const Wrapper = {
				components: { Icon },
				template: `<Icon icon="${iconName}" :onLoad='onLoad' />`,
				methods: {
					onLoad() {
						throw new Error('onLoad called for empty icon!');
					},
				},
			};
			const wrapper = mount(Wrapper, {});
		});
	});

	test('custom loader', () => {
		return new Promise((fulfill, reject) => {
			const prefix = nextPrefix();
			const name = 'constructor'; // Use reserved name to test objects
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconify iconify--${prefix} iconify--${provider}`;
			let onLoadCalled = false;

			setCustomIconLoader(
				() => {
					return iconData;
				},
				prefix,
				provider
			);

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toEqual(false);

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
				expect(iconLoaded(iconName)).toEqual(true);

				// Render component
				const Wrapper = {
					components: { Icon },
					// Also test class string
					template: `<Icon icon="${iconName}" :onLoad="onLoad" class="test" />`,
					methods: {
						onLoad(name) {
							expect(name).toEqual(iconName);
							expect(onLoadCalled).toEqual(false);
							onLoadCalled = true;
						},
					},
				};
				const wrapper = mount(Wrapper, {});

				// Check HTML on next tick
				nextTick()
					.then(() => {
						const html = wrapper.html().replace(/\s*\n\s*/g, '');
						expect(html).toEqual(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="test ' +
								className +
								'" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
						);

						// Make sure onLoad has been called
						expect(onLoadCalled).toEqual(true);

						fulfill(true);
					})
					.catch(reject);
			});
		});
	});
});
