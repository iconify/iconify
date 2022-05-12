import { mount } from '@vue/test-utils';
import { Icon } from '../../';
import { defaultIconResult } from '../empty';

describe('Empty icon', () => {
	test('basic test', () => {
		const wrapper = mount(Icon, {
			props: {},
		});

		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(defaultIconResult);
	});

	test('with child node (child node is ignored)', () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon><i class="fa fa-home" /></Icon>`,
		};

		const wrapper = mount(Wrapper, {});
		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(defaultIconResult);
	});
});
