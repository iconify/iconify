import { mount } from '@vue/test-utils';
import { Icon } from '../../offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Dimensions', () => {
	test('height', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" height="48" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		const html = wrapper.html();
		expect(html).toContain('height="48"');
		expect(html).toContain('width="48"');
		expect(html).not.toContain('height="1em"');
		expect(html).not.toContain('width="1em"');
	});

	test('width and height', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :width="32" height="48" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		const html = wrapper.html();
		expect(html).toContain('height="48"');
		expect(html).toContain('width="32"');
		expect(html).not.toContain('height="1em"');
		expect(html).not.toContain('width="1em"');
	});

	test('auto', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" height="auto" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		const html = wrapper.html();
		expect(html).toContain('height="24"');
		expect(html).toContain('width="24"');
		expect(html).not.toContain('height="1em"');
		expect(html).not.toContain('width="1em"');
	});

	test('none', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" height="none" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		const html = wrapper.html();
		expect(html).not.toContain('height="');
		expect(html).not.toContain('width="');
	});
});
