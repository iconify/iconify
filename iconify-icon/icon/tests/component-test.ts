import {
	cleanupGlobals,
	expectedBlock,
	expectedInline,
	setupDOM,
	nextTick,
	styleOpeningTag,
} from '../src/tests/helpers';
import { defineIconifyIcon, IconifyIconHTMLElement } from '../src/component';
import type { IconState } from '../src/state';

export declare interface DebugIconifyIconHTMLElement
	extends IconifyIconHTMLElement {
	// Internal stuff, used for debugging
	_shadowRoot: ShadowRoot;
	_state: IconState;
}

describe('Testing icon component', () => {
	afterEach(async () => {
		await nextTick();
		cleanupGlobals();
	});

	it('Registering component', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Make sure component does not exist and registry is available
		expect(window.customElements).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeUndefined();

		// Define component
		const IconifyIcon = defineIconifyIcon();
		expect(IconifyIcon).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeDefined();

		// Create element
		const node = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;
		expect(node instanceof IconifyIcon).toBe(true);
		expect(node.status).toBe('loading');

		// Define component again (should return previous class)
		const IconifyIcon2 = defineIconifyIcon();
		expect(IconifyIcon2).toBe(IconifyIcon);

		// Create another element
		const node2 = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;
		expect(node2 instanceof IconifyIcon).toBe(true);
		expect(node2.status).toBe('loading');
	});

	it('Creating component instance, changing properties', async () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Make sure component does not exist and registry is available
		expect(window.customElements).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeUndefined();

		// Define component
		const IconifyIcon = defineIconifyIcon();
		expect(IconifyIcon).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeDefined();

		// Create element
		const node = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;

		// Should be empty
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.status).toBe('loading');

		// Check for dynamically added methods
		expect(typeof node.loadIcon).toBe('function');
		expect(typeof IconifyIcon.loadIcon).toBe('function');

		// Set icon
		node.icon = {
			body: '<g />',
		};
		expect(node.icon).toEqual({
			body: '<g />',
		});
		expect(node.getAttribute('icon')).toBe(
			JSON.stringify({
				body: '<g />',
			})
		);

		// Should still be empty: waiting for next tick
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.status).toBe('loading');
		await nextTick();

		// Should render SVG
		const blankSVG =
			'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g></g></svg>';
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${blankSVG}`
		);
		expect(node.status).toBe('rendered');

		// Check inline attribute
		expect(node.inline).toBe(false);
		expect(node.getAttribute('inline')).toBe(null);

		// Change inline
		node.inline = true;
		expect(node.inline).toBe(true);
		expect(node.getAttribute('inline')).toBe('true');

		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedInline}</style>${blankSVG}`
		);
		expect(node.status).toBe('rendered');
	});

	it('Testing changes to inline', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Make sure component does not exist and registry is available
		expect(window.customElements).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeUndefined();

		// Define component
		const IconifyIcon = defineIconifyIcon();
		expect(IconifyIcon).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeDefined();

		// Create element
		const node = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;
		expect(node.status).toBe('loading');

		// Should be empty with block style
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);

		// Check inline
		expect(node.inline).toBe(false);
		expect(node.hasAttribute('inline')).toBe(false);
		expect(node.getAttribute('inline')).toBeFalsy();

		// Change to inline via property
		node.inline = true;

		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedInline}</style>`
		);
		expect(node.inline).toBe(true);
		expect(node.hasAttribute('inline')).toBe(true);
		expect(node.getAttribute('inline')).toBeTruthy();

		// Change to block by removing attribute
		node.removeAttribute('inline');

		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.inline).toBe(false);
		expect(node.hasAttribute('inline')).toBe(false);
		expect(node.getAttribute('inline')).toBeFalsy();

		// Change to inline by setting attribute
		node.setAttribute('inline', 'inline');

		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedInline}</style>`
		);
		expect(node.inline).toBe(true);
		expect(node.hasAttribute('inline')).toBe(true);
		expect(node.getAttribute('inline')).toBeTruthy();

		// No icon data, so still loading
		expect(node.status).toBe('loading');
	});

	it('Restarting animation', async () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Make sure component does not exist and registry is available
		expect(window.customElements).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeUndefined();

		// Define component
		expect(defineIconifyIcon()).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeDefined();

		// Create element
		const node = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;
		expect(node.status).toBe('loading');

		// Set icon
		const body =
			'<rect width="10" height="10"><animate attributeName="width" values="10;5;10" dur="10s" repeatCount="indefinite" /></rect>';
		node.icon = {
			body,
		};
		expect(node.icon).toEqual({
			body,
		});
		expect(node.getAttribute('icon')).toBe(
			JSON.stringify({
				body,
			})
		);

		// Wait to render
		await nextTick();

		// Should render SPAN, with comment
		expect(node.status).toBe('rendered');
		const renderedIconWithComment =
			"<span style=\"--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect width='10' height='10'%3E%3Canimate attributeName='width' values='10;5;10' dur='10s' repeatCount='indefinite' /%3E%3C/rect%3E%3C!-- --%3E%3C/svg%3E&quot;); width: 1em; height: 1em; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;\"></span>";
		const html1 = node._shadowRoot.innerHTML;
		expect(html1.replace(/-- [0-9]+ --/, '-- --')).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${renderedIconWithComment}`
		);

		// Restart animation, test icon again
		node.restartAnimation();

		const html2 = node._shadowRoot.innerHTML;
		expect(html2).not.toBe(html1);
		expect(html2.replace(/-- [0-9]+ --/, '-- --')).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${renderedIconWithComment}`
		);
		expect(node.status).toBe('rendered');

		// Small delay to make sure timer is increased to get new number
		await new Promise((fulfill) => {
			setTimeout(fulfill, 10);
		});

		// Restart animation again, test icon again
		node.restartAnimation();

		const html3 = node._shadowRoot.innerHTML;
		expect(html3.replace(/-- [0-9]+ --/, '-- --')).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${renderedIconWithComment}`
		);
		expect(html3).not.toBe(html1);
		expect(html3).not.toBe(html2);
		expect(node.status).toBe('rendered');
	});

	it('Restarting animation for SVG', async () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Make sure component does not exist and registry is available
		expect(window.customElements).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeUndefined();

		// Define component
		expect(defineIconifyIcon()).toBeDefined();
		expect(window.customElements.get('iconify-icon')).toBeDefined();

		// Create element
		const node = document.createElement(
			'iconify-icon'
		) as DebugIconifyIconHTMLElement;
		expect(node.status).toBe('loading');

		// Set mode by changing property
		node.mode = 'svg';
		expect(node.getAttribute('mode')).toBe('svg');

		// Set icon
		const body =
			'<rect width="10" height="10"><animate attributeName="width" values="10;5;10" dur="10s" repeatCount="indefinite" /></rect>';
		node.icon = {
			body,
		};
		expect(node.icon).toEqual({
			body,
		});
		expect(node.getAttribute('icon')).toBe(
			JSON.stringify({
				body,
			})
		);

		// Wait to render
		await nextTick();

		// Should render SVG
		expect(node.status).toBe('rendered');
		const renderedIcon =
			'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><rect width="10" height="10"><animate attributeName="width" values="10;5;10" dur="10s" repeatCount="indefinite"></animate></rect></svg>';
		const html1 = node._shadowRoot.innerHTML;
		const svg1 = node._shadowRoot.lastChild as SVGSVGElement;
		const setCurrentTimeSupported = !!svg1.setCurrentTime;
		expect(html1).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${renderedIcon}`
		);
		expect(svg1.outerHTML).toBe(renderedIcon);

		// Restart animation, test icon again
		node.restartAnimation();

		const html2 = node._shadowRoot.innerHTML;
		const svg2 = node._shadowRoot.lastChild as SVGSVGElement;
		expect(html2).toBe(html1);
		expect(svg2.outerHTML).toBe(renderedIcon);

		// Node should be different because JSDOM does not support setCurrentTime(), but that might change in future
		if (setCurrentTimeSupported) {
			expect(svg2).toBe(svg1);
		} else {
			expect(svg2).not.toBe(svg1);
		}

		expect(node.status).toBe('rendered');
	});
});
