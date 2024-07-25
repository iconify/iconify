import React from 'react';
import { Icon } from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering as span', () => {
	test('basic icon', () => {
		const renderResult = render(
			<Icon
				icon={iconData}
				mode="style"
				onLoad={() => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				}}
			/>
		);

		expect(renderResult.container.innerHTML).toEqual(
			`<span style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;"></span>`
		);
	});

	test('custom dimensions', () => {
		const renderResult = render(
			<Icon
				icon={iconData}
				mode="style"
				width="32"
				height={48}
				onLoad={() => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				}}
			/>
		);

		expect(renderResult.container.innerHTML).toEqual(
			`<span style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E&quot;); width: 32px; height: 48px; display: inline-block; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;"></span>`
		);
	});
});
