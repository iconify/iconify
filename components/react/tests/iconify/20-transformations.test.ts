import React from 'react';
import { InlineIcon } from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rotation', () => {
	test('number', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				rotate: 1,
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="rotate(90 12 12)">'
		);
	});

	test('string', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				// @ts-expect-error
				rotate: '180deg',
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
	});
});

describe('Flip', () => {
	test('boolean', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				hFlip: true,
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('string', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				flip: 'vertical',
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="translate(0 24) scale(1 -1)">'
		);
	});

	test('string and boolean', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				flip: 'horizontal',
				vFlip: true,
			})
		);

		// horizontal + vertical = 180deg rotation
		expect(component.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
		expect(component.container.innerHTML).not.toContain('scale');
	});

	test('string for boolean attribute', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				// @ts-expect-error
				hFlip: 'true',
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean', async () => {
		// 'flip' is processed after 'hFlip' because of order of elements in object, overwriting value
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				hFlip: false,
				flip: 'horizontal',
			})
		);

		expect(component.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean as string', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				flip: 'vertical',
				// @ts-expect-error
				hFlip: 'true',
			})
		);

		// horizontal + vertical = 180deg rotation
		expect(component.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
		expect(component.container.innerHTML).not.toContain('scale');
	});

	test('wrong case', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				// @ts-expect-error
				vflip: true,
			})
		);

		expect(component.container.innerHTML).not.toContain('transform');
	});
});
