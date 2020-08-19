import { mount } from '@vue/test-utils';
import IconifyIcon from '../';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconDataWithID = {
	body:
		'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>',
	width: 128,
	height: 128,
};

// Spacing for HTML matches
const spacing = (count) => {
	return '\n' + '  '.repeat(count);
};

describe('Mounting component', () => {
	test('with wrapper', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon />`,
		};

		const wrapper = mount(Wrapper, {});
		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
	});

	test('without wrapper', () => {
		const wrapper = mount(IconifyIcon, {});
		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"></svg>'
		);
	});
});

describe('Rendering icon', () => {
	test('as object', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('as string', () => {
		const iconName = 'test-string';
		IconifyIcon.addIcon(iconName, iconData);

		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' />`,
			data() {
				return {
					icon: iconName,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('replacing id', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' />`,
			data() {
				return {
					icon: iconDataWithID,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).not.toMatch('id="ssvg-id-1st-place-medala"');
	});
});

describe('Passing attributes', () => {
	test('title', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' title='Icon!' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" title="Icon!" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('aria-hidden', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :aria-hidden='false' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('ariaHidden', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :ariaHidden='false' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('attributes that cannot change', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' viewBox='0 0 0 0' preserveAspectRatio='none' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			// same values, but different order
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" width="1em" height="1em">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});
});

describe('Dimensions', () => {
	test('height', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :height='height' />`,
			data() {
				return {
					icon: iconData,
					height: 24,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('width and height', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :width='width' :height='height' />`,
			data() {
				return {
					icon: iconData,
					width: 32, // as number
					height: '48', // as string
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="32" height="48" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});

	test('auto', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :height='height' />`,
			data() {
				return {
					icon: iconData,
					height: 'auto',
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toStrictEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">' +
				spacing(1) +
				'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path>' +
				spacing(0) +
				'</svg>'
		);
	});
});

describe('Rotation', () => {
	test('number', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :rotate='rotate' />`,
			data() {
				return {
					icon: iconData,
					rotate: 1,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('rotate(90 ');
	});

	test('string', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' rotate='270deg' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('rotate(-90 ');
	});
});

describe('Flip', () => {
	test('boolean', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :horizontalFlip='horizontalFlip' />`,
			data() {
				return {
					icon: iconData,
					horizontalFlip: true,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('scale(-1 1)');
	});

	test('string', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' flip='vertical' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('scale(1 -1)');
	});

	test('string and boolean', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' flip='horizontal' :verticalFlip='true' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		// horizontal + vertical = 180deg rotation
		expect(item.html()).toMatch('rotate(180 ');
	});

	test('string for boolean attribute', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' horizontalFlip='true' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('scale(-1 1)');
	});

	test('shorthand and boolean', () => {
		// 'flip' is processed after 'hFlip', overwriting value
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' flip='horizontal' :hFlip='false' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('scale(-1 1)');
	});

	test('shorthand and boolean as string', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' flip='vertical' horizontalFlip='true' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		// horizontal + vertical = 180deg rotation
		expect(item.html()).toMatch('rotate(180 ');
	});

	test('wrong case', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' :verticalflip='verticalflip' :horizontalflip='true' />`,
			data() {
				return {
					icon: iconData,
					verticalflip: true,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).not.toMatch('scale(');
		expect(item.html()).not.toMatch('rotate(');
	});
});

describe('Alignment and slice', () => {
	test('vAlign and slice', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' vAlign='top' :slice='true' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('preserveAspectRatio="xMidYMin slice"');
	});

	test('string', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' align='left bottom' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('preserveAspectRatio="xMinYMax meet"');
	});

	test('Alignment aliases', () => {
		const Wrapper = {
			components: { IconifyIcon },
			template: `<iconify-icon :icon='icon' verticalAlign='top' horizontalAlign='right' />`,
			data() {
				return {
					icon: iconData,
				};
			},
		};
		const wrapper = mount(Wrapper, {});

		const item = wrapper.findComponent(IconifyIcon);
		expect(item.exists()).toBe(true);
		expect(item.html()).toMatch('preserveAspectRatio="xMaxYMin meet"');
	});
});
