import React from 'react';
import { Icon, InlineIcon } from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Passing attributes', () => {
	test('title', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				// @ts-expect-error
				title: 'Icon!',
			})
		);
		expect(component.container.innerHTML).toContain('title="Icon!"');
	});

	test('aria-hidden', async () => {
		const component = await render(
			createElement(InlineIcon, {
				'icon': iconData,
				'aria-hidden': 'false',
			})
		);
		expect(component.container.innerHTML).not.toContain('aria-hidden');
	});

	test('ariaHidden', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				// @ts-expect-error
				ariaHidden: 'false',
			})
		);
		expect(component.container.innerHTML).not.toContain('aria-hidden');
	});

	test('style', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				style: { verticalAlign: '0', color: 'red' },
			})
		);

		expect(component.container.innerHTML).toContain(
			'style="vertical-align: 0px; color: red;"'
		);
	});

	test('color', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				color: 'red',
			})
		);
		expect(component.container.innerHTML).toContain('style="color: red;"');
	});

	test('color with style', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				color: 'red',
				style: { color: 'green' },
			})
		);

		// `style` overrides `color`
		expect(component.container.innerHTML).toContain(
			'style="color: green;"'
		);
		expect(component.container.innerHTML).not.toContain('red');
	});

	test('attributes that cannot change', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				viewBox: '0 0 0 0',
			})
		);

		expect(component.container.innerHTML).toContain('viewBox="0 0 24 24"');
		expect(component.container.innerHTML).not.toContain('0 0 0 0');
	});
});
