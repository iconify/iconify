import React from 'react';
import { Icon, InlineIcon } from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Passing attributes', () => {
	test('title', () => {
		// @ts-expect-error
		const renderResult = render(<Icon icon={iconData} title="Icon!" />);
		expect(renderResult.container.innerHTML).toContain('title="Icon!"');
	});

	test('aria-hidden', () => {
		const renderResult = render(
			<InlineIcon icon={iconData} aria-hidden="false" />
		);
		expect(renderResult.container.innerHTML).not.toContain('aria-hidden');
	});

	test('ariaHidden', () => {
		const renderResult = render(
			// @ts-expect-error
			<InlineIcon icon={iconData} ariaHidden="false" />
		);
		expect(renderResult.container.innerHTML).not.toContain('aria-hidden');
	});

	test('style', () => {
		const renderResult = render(
			<InlineIcon
				icon={iconData}
				style={{ verticalAlign: '0', color: 'red' }}
			/>
		);
		expect(renderResult.container.innerHTML).toContain(
			'style="vertical-align: 0; color: red;"'
		);
	});

	test('color', () => {
		const renderResult = render(<Icon icon={iconData} color="red" />);
		expect(renderResult.container.innerHTML).toContain(
			'style="color: red;"'
		);
	});

	test('color with style', () => {
		const renderResult = render(
			<Icon icon={iconData} color="red" style={{ color: 'green' }} />
		);

		// `style` overrides `color`
		expect(renderResult.container.innerHTML).toContain(
			'style="color: green;"'
		);
		expect(renderResult.container.innerHTML).not.toContain('red');
	});

	test('attributes that cannot change', () => {
		const renderResult = render(
			<InlineIcon icon={iconData} viewBox="0 0 0 0" />
		);

		expect(renderResult.container.innerHTML).toContain(
			'viewBox="0 0 24 24"'
		);
		expect(renderResult.container.innerHTML).not.toContain('0 0 0 0');
	});
});
