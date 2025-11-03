import React from 'react';
import { Icon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

describe('Empty icon', () => {
	test('basic test', async () => {
		const component = await render(
			// @ts-expect-error
			createElement(Icon, {})
		);

		expect(component.container.innerHTML).toEqual('<span></span>');
	});

	test('with child node', async () => {
		const component = await render(
			// @ts-expect-error
			createElement(Icon, {
				children: createElement('i', { className: 'fa fa-home' }),
			})
		);

		expect(component.container.innerHTML).toEqual(
			'<i class="fa fa-home"></i>'
		);
	});

	test('with text child node', async () => {
		const component = await render(
			// @ts-expect-error
			createElement(Icon, {
				children: 'icon',
			})
		);

		expect(component.container.innerHTML).toEqual('icon');
	});

	test('with multiple childen', async () => {
		const component = await render(
			// @ts-expect-error
			createElement(Icon, {
				children: [
					createElement('i', { className: 'fa fa-home' }),
					'Home',
				],
			})
		);

		expect(component.container.innerHTML).toEqual(
			'<i class="fa fa-home"></i>Home'
		);
	});
});
