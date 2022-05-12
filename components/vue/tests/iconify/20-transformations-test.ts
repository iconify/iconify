import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Icon } from '../../';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rotation', () => {
	test('number', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :rotate="1" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><g transform="rotate(90 12 12)"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></g></svg>'
		);
	});

	test('string', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" rotate="180deg" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('<g transform="rotate(180 12 12)">');
	});
});

describe('Flip', () => {
	test('boolean', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :hFlip="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('string', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" flip="vertical" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain(
			'<g transform="translate(0 24) scale(1 -1)">'
		);
	});

	test('string and boolean', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" flip="horizontal" :vFlip="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('<g transform="rotate(180 12 12)">');
	});

	test('string for boolean attribute', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" horizontal-flip="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean', async () => {
		// 'flip' is processed after 'hFlip' because of order of elements in object, overwriting value
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :hFlip="false" flip="horizontal" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean as string', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" flip="vertical" :horizontal-flip="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).toContain('<g transform="rotate(180 12 12)">');
	});

	test('wrong case', async () => {
		const Wrapper = {
			components: { Icon },
			template: `<Icon :icon="icon" :vflip="true" />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};

		const wrapper = mount(Wrapper, {});
		await nextTick();

		expect(wrapper.html()).not.toContain('<g transform="');
	});
});
