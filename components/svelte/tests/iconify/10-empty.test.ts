/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Icon from '../../';

describe('Empty icon', () => {
	test('basic test', () => {
		const component = render(Icon, {});
		const html = component.container.innerHTML;

		// Empty container div
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>');
	});
});
