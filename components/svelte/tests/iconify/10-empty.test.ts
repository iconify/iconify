import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from '../../';

describe('Empty icon', () => {
	test('basic test', async () => {
		const component = await render(
			Icon,
			// @ts-ignore
			{}
		);
		const html = component.container.innerHTML;

		// Empty container div
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('');
	});
});
