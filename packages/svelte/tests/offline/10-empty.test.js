import { render } from '@testing-library/svelte';
import { Icon } from '../../dist/offline';

describe('Empty icon', () => {
	test('basic test', () => {
		const component = render(Icon, {});
		const html = component.container.innerHTML;

		// Empty container div
		expect(html).toEqual('<div></div>');
	});
});
