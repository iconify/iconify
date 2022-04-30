/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';

// Test importing from exports
import Icon from '../../offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Creating component', () => {
	test('basic icon', () => {
		const component = render(Icon, { icon: iconData });
		const node = component.container.querySelector('svg')!;
		const html = (node.parentNode as HTMLDivElement).innerHTML;

		// Check HTML
		expect(html).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
		);

		// Make sure getAttribute() works, used in other tests
		expect(node.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
		expect(node.getAttribute('aria-hidden')).toBe('true');

		// Make sure style exists
		const style = node.style;
		expect(typeof style).toBe('object');
	});
});
