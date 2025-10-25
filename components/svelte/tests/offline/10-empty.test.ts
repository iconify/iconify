import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from '../../offline';

describe('Empty icon', () => {
	test('basic test', () => {
		const renderResult = render(
			Icon,
			// @ts-expect-error
			{}
		);
		expect(
			renderResult.container.innerHTML.replace(/<!--(.*?)-->/gm, '')
		).toEqual('');
	});
});
