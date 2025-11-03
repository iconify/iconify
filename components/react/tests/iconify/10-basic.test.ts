import React from 'react';
import {
	Icon,
	InlineIcon,
	setCustomIconLoader,
	loadIcon,
} from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Creating component using object', () => {
	test('basic icon', async () => {
		const component = await render(
			createElement(Icon, {
				icon: iconData,
				onLoad: () => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				},
			})
		);

		expect(component.container.innerHTML).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
		);
	});

	test('inline icon', async () => {
		const component = await render(
			createElement(InlineIcon, {
				icon: iconData,
			})
		);

		expect(component.container.innerHTML).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" style="vertical-align: -0.125em;"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
		);
	});

	test('custom loader', async () => {
		const prefix = 'customLoader';
		const name = 'TestIcon';

		// Set custom loader and load icon data
		setCustomIconLoader(() => {
			return iconData;
		}, prefix);
		await loadIcon(`${prefix}:${name}`);

		// Create component
		const component = await render(
			createElement(Icon, {
				icon: `${prefix}:${name}`,
				ssr: true,
			})
		);

		expect(component.container.innerHTML).toEqual(
			`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--${prefix}" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>`
		);
	});
});
