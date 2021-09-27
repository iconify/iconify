/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';

// Test importing from offline.mjs
import Icon from '../../dist/offline';

describe('Empty icon', () => {
	test('basic test', () => {
		const component = render(Icon, {});
		const html = component.container.innerHTML;

		// Empty container div
		expect(html).toBe('<div></div>');
	});
});
