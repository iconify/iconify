import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from '../../offline';

describe('Empty icon', () => {
	test('basic test', async () => {
		const renderResult = await render(
			Icon,
			// @ts-ignore
			{}
		);
		expect(
			renderResult.container.innerHTML.replace(/<!--(.*?)-->/gm, '')
		).toEqual('');
	});
});
