import { describe, test, expect } from 'vitest';
import React from 'react';
import { Icon } from '../dist/iconify';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Creating component', () => {
	test('basic icon', () => {
		const renderResult = render(<Icon icon={iconData} />);
		const html = renderResult.container.innerHTML;

		expect(renderResult.container.innerHTML).toEqual(
			`<iconify-icon icon="${JSON.stringify(iconData).replaceAll(
				'"',
				'&quot;'
			)}"></iconify-icon>`
		);
	});
});
