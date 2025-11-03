import React from 'react';
import { Icon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('boolean true', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				inline: true,
			})
		);

		expect(component.container.innerHTML).toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('string', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				// @ts-expect-error
				inline: 'true',
			})
		);

		expect(component.container.innerHTML).toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('false', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				inline: false,
			})
		);

		expect(component.container.innerHTML).not.toContain('vertical-align');
	});

	test('false string', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				// "false" should be ignored
				// @ts-expect-error
				inline: 'false',
			})
		);

		expect(component.container.innerHTML).not.toContain('vertical-align');
	});
});
