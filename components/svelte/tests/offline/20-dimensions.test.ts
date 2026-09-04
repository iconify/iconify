import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from '../../offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Dimensions', () => {
	test('height', async () => {
		const component = await render(Icon, { icon: iconData, height: '48' });
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('48');
		expect(node.getAttribute('width')).toBe('48');
	});

	test('width and height', async () => {
		const component = await render(Icon, {
			icon: iconData,
			// Mixing numbers and strings
			width: 32,
			height: '48',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('48');
		expect(node.getAttribute('width')).toBe('32');
	});

	test('auto', async () => {
		const component = await render(Icon, {
			icon: iconData,
			height: 'auto',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('24');
		expect(node.getAttribute('width')).toBe('24');
	});

	test('none', async () => {
		const component = await render(Icon, {
			icon: iconData,
			height: 'none',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe(null);
		expect(node.getAttribute('width')).toBe(null);
	});
});
