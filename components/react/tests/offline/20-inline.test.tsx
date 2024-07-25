import React from 'react';
import { Icon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('boolean true', () => {
		const renderResult = render(<Icon icon={iconData} inline={true} />);
		expect(renderResult.container.innerHTML).toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('string', () => {
		// @ts-expect-error
		const renderResult = render(<Icon icon={iconData} inline="true" />);
		expect(renderResult.container.innerHTML).toContain(
			'style="vertical-align: -0.125em;"'
		);
	});

	test('false', () => {
		const renderResult = render(<Icon icon={iconData} inline={false} />);
		expect(renderResult.container.innerHTML).not.toContain(
			'vertical-align'
		);
	});

	test('false string', () => {
		// "false" should be ignored
		// @ts-expect-error
		const renderResult = render(<Icon icon={iconData} inline="false" />);
		expect(renderResult.container.innerHTML).not.toContain(
			'vertical-align'
		);
	});
});
