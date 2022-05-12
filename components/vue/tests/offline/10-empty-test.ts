import { mount } from '@vue/test-utils';
// Import from alias
import { Icon } from '../../offline';
import { emptyString } from '../empty';

describe('Empty icon', () => {
	test('basic test', () => {
		const wrapper = mount(Icon, {
			props: {},
		});

		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(emptyString);
	});

	test('with child node', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon><i class="fa fa-home" /></Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
			'<i class="fa fa-home"></i>'
		);
	});

	test('with text child node', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon>icon</Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe('icon');
	});

	test('with multiple childen', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon><i class="fa fa-home" />Home icon</Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
			'<i class="fa fa-home"></i>Home icon'
		);
	});
});
