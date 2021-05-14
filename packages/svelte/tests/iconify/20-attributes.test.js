import { render } from '@testing-library/svelte';
import Icon from '../../dist/';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Padding attributes', () => {
	test('title', () => {
		const component = render(Icon, { icon: iconData, title: 'Icon!' });
		const node = component.container.querySelector('svg');
		expect(node.getAttribute('title')).toEqual('Icon!');
	});

	test('aria-hidden', () => {
		// dashes, string value
		const component = render(Icon, {
			'icon': iconData,
			'aria-hidden': 'false',
		});
		const node = component.container.querySelector('svg');
		expect(node.getAttribute('aria-hidden')).toEqual(null);
	});

	test('ariaHidden', () => {
		// camelCase, boolean value
		const component = render(Icon, {
			icon: iconData,
			ariaHidden: false,
		});
		const node = component.container.querySelector('svg');
		expect(node.getAttribute('aria-hidden')).toEqual(null);
	});

	test('style', () => {
		const component = render(Icon, {
			icon: iconData,
			style: 'vertical-align: 0; color: red;',
		});
		const node = component.container.querySelector('svg');
		expect(node.style.verticalAlign).toEqual('0');
		expect(node.style.color).toEqual('red');
	});

	test('color', () => {
		const component = render(Icon, {
			icon: iconData,
			color: 'red',
		});
		const node = component.container.querySelector('svg');
		expect(node.style.color).toEqual('red');
	});

	test('color with style', () => {
		const component = render(Icon, {
			icon: iconData,
			color: 'red',
			style: 'color: green;',
		});
		const node = component.container.querySelector('svg');
		expect(node.style.color).toEqual('red');
	});

	test('attributes that cannot change', () => {
		const component = render(Icon, {
			icon: iconData,
			viewBox: '0 0 0 0',
			preserveAspectRatio: 'none',
		});
		const node = component.container.querySelector('svg');
		expect(node.getAttribute('viewBox')).toEqual('0 0 24 24');
		expect(node.getAttribute('preserveAspectRatio')).toEqual(
			'xMidYMid meet'
		);
	});
});
