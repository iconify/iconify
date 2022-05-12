import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Icon } from '../../';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Passing attributes', () => {
	test('title', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" title="Icon!" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		const html = wrapper.html();
		expect(html).toContain('role="img" title="Icon!"');

		// Make sure aria-hidden exists (for tests below)
		expect(html).toContain('aria-hidden="true"');
	});

	test('aria-hidden', async () => {
		// dashes, string value
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" aria-hidden="false" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).not.toContain('aria-hidden="true"');
	});

	test('ariaHidden', async () => {
		// camelCase, boolean value
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :ariaHidden="false" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).not.toContain('aria-hidden="true"');
	});

	test('style as string', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" style="color: red;" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="color: red;"');
	});

	test('style as object', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :style="style" />`,
			data() {
				return {
					icon: iconData,
					style: {
						color: 'red',
					},
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="color: red;"');
	});

	test('color', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" color="red" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="color: red;"');
	});

	test('color with style', async () => {
		// Style overrides color
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" color="green" style="color: purple;" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="color: purple;"');
	});

	test('attributes that cannot change', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" viewBox="0 0 0 0" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		const html = wrapper.html();
		expect(html).not.toContain('viewBox="0 0 0 0"');
	});

	test('class', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" class="test-icon" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('class="test-icon"');
	});

	test('class object', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :class="{active: isActive, iconify: true}" />`,
			data() {
				return {
					icon: iconData,
					isActive: true,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('class="active iconify"');
	});
});
