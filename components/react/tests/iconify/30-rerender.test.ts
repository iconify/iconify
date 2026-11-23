import { Icon } from '../../dist/iconify';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { createElement } from 'react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconData2 = {
	body: '<path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"/>',
	width: 32,
	height: 32,
};

const iconWithIDs = {
	body: '<defs><linearGradient id="grad"><stop offset="0" stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs><path d="M0 0h24v24H0z" fill="url(#grad)"/>',
	width: 24,
	height: 24,
};

describe('Re-rendering component', () => {
	test('keeps SVG content when icon does not change', async () => {
		const component = await render(
			createElement(Icon, { icon: iconData, className: 'first' })
		);
		const path = component.container.querySelector('path');
		expect(path).not.toBeNull();

		// Re-render with same icon, but different props that do not affect content
		await component.rerender(
			createElement(Icon, { icon: iconData, className: 'second' })
		);
		expect(
			component.container.querySelector('svg')!.getAttribute('class')
		).toEqual('second');
		expect(component.container.querySelector('path')).toBe(path);

		// Change icon: content must be replaced
		await component.rerender(
			createElement(Icon, { icon: iconData2, className: 'second' })
		);
		const newPath = component.container.querySelector('path');
		expect(newPath).not.toBe(path);
		expect(newPath!.getAttribute('d')).toEqual(
			'M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z'
		);
	});

	test('keeps SVG content and IDs when icon with IDs does not change', async () => {
		const component = await render(
			createElement(Icon, { icon: iconWithIDs, className: 'first' })
		);
		const gradient = component.container.querySelector('linearGradient')!;
		const path = component.container.querySelector('path')!;
		const id = gradient.getAttribute('id');
		expect(path.getAttribute('fill')).toEqual(`url(#${id})`);

		await component.rerender(
			createElement(Icon, { icon: iconWithIDs, className: 'second' })
		);
		expect(component.container.querySelector('linearGradient')).toBe(
			gradient
		);
		expect(component.container.querySelector('path')).toBe(path);
		expect(gradient.getAttribute('id')).toEqual(id);
	});

	test('replaces SVG content when transformation changes', async () => {
		const component = await render(createElement(Icon, { icon: iconData }));
		const path = component.container.querySelector('path');

		await component.rerender(
			createElement(Icon, { icon: iconData, hFlip: true })
		);
		const newPath = component.container.querySelector('path');
		expect(newPath).not.toBe(path);
		expect(newPath!.parentElement!.tagName).toEqual('g');
	});
});
