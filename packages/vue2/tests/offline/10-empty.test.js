import { mount } from '@vue/test-utils';
import { Icon } from '../../dist/offline';

describe('Empty icon', () => {
	test('basic test', () => {
		const wrapper = mount(Icon, {
			propsData: {},
		});

		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual('');
	});

	test('with child node', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon><i class="fa fa-home" /></Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
			'<i class="fa fa-home"></i>'
		);
	});

	test('with text child node', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon>icon</Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.text()).toEqual('icon');
	});

	test('with multiple childen', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon><i class="fa fa-home" /> Home icon</Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toEqual(
			'<span><i class="fa fa-home"></i> Home icon</span>'
		);
	});
});
