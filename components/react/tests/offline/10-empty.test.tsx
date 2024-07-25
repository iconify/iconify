import React from 'react';
import { Icon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Empty icon', () => {
	test('basic test', () => {
		// @ts-expect-error
		const renderResult = render(<Icon />);

		expect(renderResult.container.innerHTML).toEqual('<span></span>');
	});

	test('with child node', () => {
		const renderResult = render(
			// @ts-expect-error
			<Icon>
				<i className="fa fa-home" />
			</Icon>
		);

		expect(renderResult.container.innerHTML).toEqual(
			'<i class="fa fa-home"></i>'
		);
	});

	test('with text child node', () => {
		// @ts-expect-error
		const renderResult = render(<Icon>icon</Icon>);

		expect(renderResult.container.innerHTML).toEqual('icon');
	});

	test('with multiple childen', () => {
		const renderResult = render(
			// @ts-expect-error
			<Icon>
				<i className="fa fa-home" />
				Home
			</Icon>
		);

		expect(renderResult.container.innerHTML).toEqual(
			'<i class="fa fa-home"></i>Home'
		);
	});
});
