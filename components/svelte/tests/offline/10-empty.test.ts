import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from '../../offline';

describe('Empty icon', () => {
	test('basic test', () => {
		const renderResult = render(Icon, {});
		expect(
			renderResult.container.innerHTML.replace(/<!--(.*?)-->/gm, '')
		).toEqual('');
	});
});
