import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../../';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Padding attributes', () => {
	test('title', () => {
		const component = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			title: 'Icon!',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('title')).toBe('Icon!');
	});

	test('aria-hidden', () => {
		// dashes, string value
		const component = render(Icon, {
			'icon': iconData,
			'aria-hidden': 'false',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('aria-hidden')).toEqual(null);
	});

	test('ariaHidden', () => {
		// camelCase, boolean value
		const component = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			ariaHidden: false,
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('aria-hidden')).toBe(null);
	});

	test('style', () => {
		const component = render(Icon, {
			icon: iconData,
			style: 'vertical-align: 0; color: red;',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.style.verticalAlign).toBe('0');
		expect(node.style.color).toBe('red');
	});

	test('color', () => {
		const component = render(Icon, {
			icon: iconData,
			color: 'red',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.style.color).toBe('red');
	});

	test('color with style', () => {
		const component = render(Icon, {
			icon: iconData,
			color: 'red',
			style: 'color: green;',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.style.color).toBe('red');
	});

	test('attributes that cannot change', () => {
		const component = render(Icon, {
			icon: iconData,
			viewBox: '0 0 0 0',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('viewBox')).toBe('0 0 24 24');
	});
});
