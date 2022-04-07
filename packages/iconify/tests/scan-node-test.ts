import { cleanupGlobals, setupDOM, waitDOMReady } from './helpers';
import { scanRootNode } from '../src/scanner/find';
import { getElementProps } from '../src/scanner/get-props';

describe('Testing scanning nodes', () => {
	afterEach(cleanupGlobals);

	it('Finding basic placeholders', async () => {
		setupDOM(`
<span class="iconify" data-icon="mdi:home"></span>
<span class="iconify-inline" data-icon="mdi-light:home"></span>
<p>
	<i class="iconify" data-icon="mdi:home-outline"></i>
	<i class="iconify-inline" data-icon="ic:baseline-home"></i>
</p>
`);

		await waitDOMReady();

		const root = document.documentElement;
		const items = scanRootNode(root);

		// 4 nodes
		expect(items.length).toBe(4);

		// span.iconify
		const node0 = root.querySelector('span.iconify');
		expect(items[0].node).toEqual(node0);
		expect(items[0].props).toEqual(getElementProps(node0));

		// span.iconify-inline
		const node1 = root.querySelector('span.iconify-inline');
		expect(items[1].node).toEqual(node1);
		expect(items[1].props).toEqual(getElementProps(node1));

		// i.iconify
		const node2 = root.querySelector('i.iconify');
		expect(items[2].node).toEqual(node2);
		expect(items[2].props).toEqual(getElementProps(node2));

		// i.iconify-inline
		const node3 = root.querySelector('i.iconify-inline');
		expect(items[3].node).toEqual(node3);
		expect(items[3].props).toEqual(getElementProps(node3));
	});

	it('Invalid placeholders', async () => {
		setupDOM(`
<span class="iconify" data-icon="badicon"></span>
<span data-icon="prefix:missing-class"></span>
<strong class="iconify" data-icon="prefix:invalid-tag"></strong>
<svg class="iconify iconify--prefix" data-icon="prefix:svg-without-data"></svg>
`);

		await waitDOMReady();

		const root = document.documentElement;
		const items = scanRootNode(root);

		expect(items.length).toBe(0);
	});
});
