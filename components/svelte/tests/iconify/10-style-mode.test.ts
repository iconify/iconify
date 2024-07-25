import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../..';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering as span', () => {
	test('basic icon', () => {
		const component = render(Icon, {
			'icon': iconData,
			'mode': 'style',
			'on:load': () => {
				// Should be called only for icons loaded from API
				throw new Error('onLoad called for object!');
			},
		});
		const node = component.container.querySelector(
			'span'
		) as HTMLSpanElement;
		expect(node).not.toBeNull();
		expect(node.parentNode).not.toBeNull();
		const html = node.outerHTML;

		// Check HTML
		expect(html).toBe(
			"<span style=\"--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;\"></span>"
		);
	});

	test('custom dimensions', () => {
		const component = render(Icon, {
			'icon': iconData,
			'mode': 'style',
			'width': '48',
			'height': 32,
			'on:load': () => {
				// Should be called only for icons loaded from API
				throw new Error('onLoad called for object!');
			},
		});
		const node = component.container.querySelector(
			'span'
		) as HTMLSpanElement;
		expect(node).not.toBeNull();
		expect(node.parentNode).not.toBeNull();
		const html = node.outerHTML;

		// Check HTML
		expect(html).toBe(
			"<span style=\"--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E&quot;); width: 48px; height: 32px; display: inline-block; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;\"></span>"
		);
	});
});
