import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../../offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 32,
};

describe('Rotation', () => {
	test('number', () => {
		const component = render(Icon, { icon: iconData, rotate: 1 });
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe('rotate(90 16 16)');
	});

	test('string', () => {
		const component = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			rotate: '180deg',
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe('rotate(180 12 16)');
	});
});

describe('Flip', () => {
	test('boolean', () => {
		const component = render(Icon, { icon: iconData, hFlip: true });
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe(
			'translate(24 0) scale(-1 1)'
		);
	});

	test('string', () => {
		const component = render(Icon, { icon: iconData, flip: 'vertical' });
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe(
			'translate(0 32) scale(1 -1)'
		);
	});

	test('string and boolean', () => {
		const component = render(Icon, {
			icon: iconData,
			flip: 'horizontal',
			vFlip: true,
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		// horizontal + vertical = 180deg rotation
		expect(child.getAttribute('transform')).toBe('rotate(180 12 16)');
	});

	test('string for boolean attribute', () => {
		const component = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			hFlip: 'true',
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe(
			'translate(24 0) scale(-1 1)'
		);
	});

	test('shorthand and boolean', () => {
		// 'flip' is processed after 'hFlip' because of order of elements in object, overwriting value
		const component = render(Icon, {
			icon: iconData,
			hFlip: false,
			flip: 'horizontal',
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe(
			'translate(24 0) scale(-1 1)'
		);
	});

	test('shorthand and boolean as string', () => {
		const component = render(Icon, {
			icon: iconData,
			flip: 'vertical',
			hFlip: true,
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('g');
		expect(child.getAttribute('transform')).toBe('rotate(180 12 16)');
	});

	test('wrong case', () => {
		const component = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			vflip: true,
		});
		const node = component.container.querySelector('svg')!;

		// Find first child node
		const child = node.childNodes[0] as SVGGElement;
		expect(child.tagName).toBe('path');
	});
});
