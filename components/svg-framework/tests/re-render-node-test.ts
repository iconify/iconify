import { iconDefaults } from '@iconify/utils/lib/icon';
import { cleanupGlobals, setupDOM, waitDOMReady } from './helpers';
import { scanRootNode } from '../src/scanner/find';
import { renderInlineSVG } from '../src/render/svg';
import type { IconifyIcon } from '@iconify/utils/lib/icon';
import { elementDataProperty, IconifyElement } from '../src/scanner/config';

describe('Testing re-rendering nodes', () => {
	afterEach(cleanupGlobals);

	type TestIconCallback = (svg: IconifyElement) => IconifyIcon;

	const testIcon = async (
		placeholder: string,
		data: IconifyIcon,
		expected1: string,
		callback1: TestIconCallback,
		expected2: string,
		callback2?: TestIconCallback,
		expected3?: string
	): Promise<IconifyElement> => {
		setupDOM(placeholder);

		await waitDOMReady();

		function scan(expected: string): IconifyElement {
			// Find node
			const root = document.body;
			const items = scanRootNode(root);

			expect(items.length).toBe(1);

			// Get node and render it
			const { node, props } = items[0];
			const svg = renderInlineSVG(node, props, {
				...iconDefaults,
				...data,
			});

			// Find SVG in DOM
			expect(root.childNodes.length).toBe(1);
			const expectedSVG = root.childNodes[0];
			expect(expectedSVG).toBe(svg);

			// Get HTML
			const html = root.innerHTML;
			expect(html).toBe(expected);

			return svg;
		}

		// Initial scan
		const svg1 = scan(expected1);

		// Change element
		data = callback1(svg1);

		// Scan again
		const svg2 = scan(expected2);

		if (!callback2) {
			return svg2;
		}

		// Change element again
		data = callback2(svg2);

		// Scan DOM and return result
		return scan(expected3);
	};

	it('Changing content', async () => {
		const svg = await testIcon(
			'<span class="iconify" data-icon="mdi:home"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" class="iconify iconify--mdi"><g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual([]);

				// Change icon name and size
				svg.setAttribute('data-icon', 'mdi-light:home-outline');
				svg.setAttribute('data-height', 'auto');

				return {
					body: '<path d="" />',
					width: 32,
					height: 32,
				};
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 32 32" data-icon="mdi-light:home-outline" data-height="auto" class="iconify iconify--mdi-light"><path d=""></path></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconify--mdi-light']);
		expect(data.addedStyles).toEqual([]);
	});

	it('Toggle inline and block using class', async () => {
		const iconData: IconifyIcon = {
			body: '<g />',
			width: 24,
			height: 24,
		};

		const svg = await testIcon(
			'<span class="iconify" data-icon="mdi:home"></span>',
			iconData,
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" class="iconify iconify--mdi"><g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual([]);

				// Set inline by adding class
				svg.classList.add('iconify-inline');

				return iconData;
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" class="iconify iconify--mdi iconify-inline" style="vertical-align: -0.125em;"><g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual(['vertical-align']);

				// Set block by removing class
				svg.classList.remove('iconify-inline');

				return iconData;
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" style="" class="iconify iconify--mdi"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconify--mdi']);
		expect(data.addedStyles).toEqual([]);
	});

	it('Toggle inline and block using attributes', async () => {
		const iconData: IconifyIcon = {
			body: '<g />',
			width: 24,
			height: 24,
		};

		const svg = await testIcon(
			'<span class="iconify" data-icon="mdi:home"></span>',
			iconData,
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" class="iconify iconify--mdi"><g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual([]);

				// Set inline by adding attribute
				svg.setAttribute('data-inline', 'data-inline');

				return iconData;
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" data-inline="data-inline" class="iconify iconify--mdi" style="vertical-align: -0.125em;"><g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual(['vertical-align']);

				// Set block by setting empty attribute
				svg.setAttribute('data-inline', '');

				return iconData;
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" data-inline="" style="" class="iconify iconify--mdi"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconify--mdi']);
		expect(data.addedStyles).toEqual([]);
	});

	it('Transformations', async () => {
		const svg = await testIcon(
			'<span class="iconify" data-icon="mdi:home" data-flip="horizontal"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" data-flip="horizontal" class="iconify iconify--mdi"><g transform="translate(24 0) scale(-1 1)"><g></g></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual([]);

				// Rotate and flip
				svg.setAttribute('data-rotate', '90deg');
				svg.setAttribute('data-flip', 'vertical');

				return {
					body: '<path d="" />',
					width: 32,
					height: 32,
				};
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 32 32" data-icon="mdi:home" data-flip="vertical" data-rotate="90deg" class="iconify iconify--mdi"><g transform="rotate(90 16 16) translate(0 32) scale(1 -1)"><path d=""></path></g></svg>',
			(svg) => {
				const data = svg[elementDataProperty];
				expect(data.status).toBe('loaded');
				expect(data.addedClasses).toEqual(['iconify--mdi']);
				expect(data.addedStyles).toEqual([]);

				// Rotate and remove flip
				svg.setAttribute('data-rotate', '180deg');
				svg.removeAttribute('data-flip');

				return {
					body: '<g />',
				};
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="mdi:home" data-rotate="180deg" class="iconify iconify--mdi"><g transform="rotate(180 8 8)"><g></g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconify--mdi']);
		expect(data.addedStyles).toEqual([]);
	});
});
