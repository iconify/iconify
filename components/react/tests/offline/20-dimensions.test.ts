import React from 'react';
import { InlineIcon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Dimensions', () => {
	test('height', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				height: 48,
			})
		);

		expect(component.container.innerHTML).toContain(
			'width="48" height="48"'
		);
		expect(component.container.innerHTML).not.toContain('1em');
	});

	test('width and height', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				width: 32,
				height: '48',
			})
		);

		expect(component.container.innerHTML).toContain(
			'width="32" height="48"'
		);
		expect(component.container.innerHTML).not.toContain('1em');
	});

	test('auto', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				height: 'auto',
			})
		);

		expect(component.container.innerHTML).toContain(
			'width="24" height="24"'
		);
		expect(component.container.innerHTML).not.toContain('1em');
	});

	test('unset', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
				height: 'unset',
			})
		);

		expect(component.container.innerHTML).not.toContain('width=');
		expect(component.container.innerHTML).not.toContain('height=');
	});
});
