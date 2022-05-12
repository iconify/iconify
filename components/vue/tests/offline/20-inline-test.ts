import { mount } from '@vue/test-utils';
import { Icon } from '../../dist/offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('string', () => {
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
		expect(wrapper.html()).toContain('style="vertical-align: -0.125em;"');
	});

	test('false string', () => {
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
		expect(wrapper.html()).not.toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('true', () => {
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
		expect(wrapper.html()).toContain('style="vertical-align: -0.125em;"');
	});

	test('false', () => {
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
		expect(wrapper.html()).not.toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('inline and style string', () => {
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
		expect(wrapper.html()).toContain(
			'style="vertical-align: -0.125em; color: red;"'
		);
	});

	test('inline and style object', () => {
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
		expect(wrapper.html()).toContain(
			'style="vertical-align: -0.125em; color: red;"'
		);
	});

	test('inline and style overriding it', () => {
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
		expect(wrapper.html()).toContain('style="vertical-align: 0;"');
	});
});
