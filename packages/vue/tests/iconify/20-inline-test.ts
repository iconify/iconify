import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Icon } from '../../';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('string', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" inline="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="vertical-align: -0.125em;"');
	});

	test('false string', async () => {
		// "false" should be ignored
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" inline="false" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).not.toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('true', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :inline="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('style="vertical-align: -0.125em;"');
	});

	test('false', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :inline="false" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).not.toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('inline and style string', async () => {
		// Style goes after vertical-align
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :inline="true" style="color: red;" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain(
			'style="vertical-align: -0.125em; color: red;"'
		);
	});

	test('inline and style object', async () => {
		// Style goes after vertical-align
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :inline="true" :style="style" />`,
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

		expect(wrapper.html()).toContain(
			'style="vertical-align: -0.125em; color: red;"'
		);
	});

	test('inline and style overriding it', async () => {
		// Style goes after vertical-align
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :inline="true" :style="style" />`,
			data() {
				return {
					icon: iconData,
					style: {
						verticalAlign: 0,
					},
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('vertical-align: 0;"');
	});
});
