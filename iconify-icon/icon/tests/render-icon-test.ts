import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import {
	cleanupGlobals,
	expectedBlock,
	expectedInline,
	setupDOM,
	styleOpeningTag,
} from '../src/tests/helpers';
import { updateStyle } from '../src/render/style';
import { renderIcon } from '../src/render/icon';
import { defaultCustomisations } from '../src/attributes/customisations';

describe('Testing rendering loaded icon', () => {
	afterEach(cleanupGlobals);

	it('Render as SVG', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Create container node and add style
		const node = doc.createElement('div');
		updateStyle(node, false);

		// Render SVG
		renderIcon(node, {
			rendered: true,
			icon: {
				value: 'whatever',
				data: {
					...defaultIconProps,
					body: '<g />',
				},
			},
			renderedMode: 'svg',
			inline: false,
			customisations: {
				...defaultCustomisations,
			},
		});

		// Test HTML
		expect(node.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g></g></svg>`
		);

		// Replace icon content
		renderIcon(node, {
			rendered: true,
			icon: {
				value: 'whatever',
				data: {
					...defaultIconProps,
					width: 24,
					height: 24,
					body: '<g><path d="" /></g>',
				},
			},
			renderedMode: 'svg',
			inline: false,
			customisations: {
				...defaultCustomisations,
				rotate: 1,
				height: 'auto',
			},
		});

		// Test HTML
		expect(node.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(90 12 12)"><g><path d=""></path></g></g></svg>`
		);
	});

	it('SVG with custom preserveAspectRatio', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Create container node and add style
		const node = doc.createElement('div');
		updateStyle(node, false);

		// Render SVG
		renderIcon(node, {
			rendered: true,
			icon: {
				value: 'whatever',
				data: {
					...defaultIconProps,
					body: '<g />',
				},
			},
			renderedMode: 'svg',
			inline: false,
			customisations: {
				...defaultCustomisations,
				preserveAspectRatio: 'xMidYMid meet',
			},
		});

		// Test HTML
		expect(node.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet"><g></g></svg>`
		);
	});

	it('Render as SPAN', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Create container node and add style
		const node = doc.createElement('div');
		updateStyle(node, true);

		// Render SVG
		renderIcon(node, {
			rendered: true,
			icon: {
				value: 'whatever',
				data: {
					...defaultIconProps,
					body: '<g />',
				},
			},
			renderedMode: 'mask',
			inline: true,
			customisations: {
				...defaultCustomisations,
			},
		});

		// Test HTML
		expect(node.innerHTML).toBe(
			`${styleOpeningTag}${expectedInline}</style><span style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;"></span>`
		);

		// Change mode to background, add some customisations
		renderIcon(node, {
			rendered: true,
			icon: {
				value: 'whatever',
				data: {
					...defaultIconProps,
					body: '<g />',
				},
			},
			renderedMode: 'bg',
			inline: true,
			customisations: {
				...defaultCustomisations,
				width: 24,
			},
		});

		// Test HTML
		expect(node.innerHTML).toBe(
			`${styleOpeningTag}${expectedInline}</style><span style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 24px; height: 24px; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></span>`
		);
	});
});
