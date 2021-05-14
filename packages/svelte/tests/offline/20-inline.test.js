import { render } from '@testing-library/svelte';
import Icon from '../../dist/offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('boolean true', () => {
		const component = render(Icon, { icon: iconData, inline: true });
		const node = component.container.querySelector('svg');
		const style = node.style;

		expect(style.verticalAlign).toEqual('-0.125em');
	});

	test('string true', () => {
		const component = render(Icon, { icon: iconData, inline: 'true' });
		const node = component.container.querySelector('svg');
		const style = node.style;

		expect(style.verticalAlign).toEqual('-0.125em');
	});

	test('false', () => {
		const component = render(Icon, { icon: iconData, inline: false });
		const node = component.container.querySelector('svg');
		const style = node.style;

		expect(style.verticalAlign).toEqual('');
	});

	test('false string', () => {
		// "false" should be ignored
		const component = render(Icon, { icon: iconData, inline: 'false' });
		const node = component.container.querySelector('svg');
		const style = node.style;

		expect(style.verticalAlign).toEqual('');
	});
});
