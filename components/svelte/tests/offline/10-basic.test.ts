import { describe, test, expect } from 'vitest';
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
		const renderResult = render(Icon, { icon: iconData });
		expect(
			renderResult.container.innerHTML.replace(/<!--(.*?)-->/gm, '')
		).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
		);
	});
});
