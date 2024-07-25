import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../../offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Padding attributes', () => {
	test('title', () => {
		const renderResult = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			title: 'Icon!',
		});
		expect(renderResult.container.innerHTML).toContain('title="Icon!"');
	});

	test('aria-hidden', () => {
		// dashes, string value
		const renderResult = render(Icon, {
			'icon': iconData,
			'aria-hidden': 'false',
		});
		expect(renderResult.container.innerHTML).not.toContain('aria-hidden');
	});

	test('ariaHidden', () => {
		// camelCase, boolean value
		const renderResult = render(Icon, {
			icon: iconData,
			// @ts-expect-error
			ariaHidden: false,
		});
		expect(renderResult.container.innerHTML).not.toContain('aria-hidden');
	});

	test('style', () => {
		const renderResult = render(Icon, {
			icon: iconData,
			style: 'vertical-align: 0; color: red;',
		});
		expect(renderResult.container.innerHTML).toContain(
			'style="vertical-align: 0; color: red;"'
		);
	});

	test('color', () => {
		const renderResult = render(Icon, {
			icon: iconData,
			color: 'red',
		});
		expect(renderResult.container.innerHTML).toContain(
			'style="color: red;"'
		);
	});

	test('color with style', () => {
		const renderResult = render(Icon, {
			icon: iconData,
			color: 'red',
			style: 'color: green;',
		});

		// In Svelte component, `color` overrides `style`
		expect(renderResult.container.innerHTML).toContain(
			'style="color: red;"'
		);
		expect(renderResult.container.innerHTML).not.toContain('green');
	});

	test('attributes that cannot change', () => {
		const renderResult = render(Icon, {
			icon: iconData,
			viewBox: '0 0 0 0',
		});

		expect(renderResult.container.innerHTML).toContain(
			'viewBox="0 0 24 24"'
		);
		expect(renderResult.container.innerHTML).not.toContain('0 0 0 0');
	});
});
