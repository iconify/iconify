import {
	cleanupGlobals,
	expectedBlock,
	setupDOM,
	nextTick,
	nextPrefix,
	fakeAPI,
	mockAPIData,
	awaitUntil,
	styleOpeningTag,
} from '../src/tests/helpers';
import { defineIconifyIcon, IconifyIconHTMLElement } from '../src/component';
import type { IconState } from '../src/state';
import type { IconifyMockAPIDelayDoneCallback } from '@iconify/core/lib/api/modules/mock';

export declare interface DebugIconifyIconHTMLElement
	extends IconifyIconHTMLElement {
	// Internal stuff, used for debugging
	_shadowRoot: ShadowRoot;
	_state: IconState;
}

describe('Testing icon component with API', () => {
	afterEach(async () => {
		await nextTick();
		cleanupGlobals();
	});

	it('Loading icon from API', async () => {
		// Setup DOM and fake API
		const doc = setupDOM('').window.document;
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

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

		// Mock data
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;

		let sendQuery: IconifyMockAPIDelayDoneCallback | undefined;
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name]: {
						body: '<g />',
					},
				},
			},
			delay: (next) => {
				sendQuery = next;
			},
		});

		// Set icon
		node.setAttribute('icon', iconName);
		expect(node.icon).toEqual(iconName);
		expect(node.getAttribute('icon')).toBe(iconName);

		// Should not have sent query to API yet
		expect(sendQuery).toBeUndefined();
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.status).toBe('loading');

		// Wait until sendQuery is defined and send response
		await awaitUntil(() => !!sendQuery);
		sendQuery();

		// Wait until icon exists
		const iconLoaded = node.iconLoaded;
		await awaitUntil(() => iconLoaded(iconName));

		// Wait for render
		await nextTick();

		// Should render SVG
		const blankSVG =
			'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g></g></svg>';
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>${blankSVG}`
		);
		expect(node.status).toBe('rendered');
	});

	it('Failing to load from API', async () => {
		// Setup DOM and fake API
		const doc = setupDOM('').window.document;
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

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

		// Mock data
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;

		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {},
				not_found: [name],
			},
		});

		// Set icon
		node.setAttribute('icon', iconName);
		expect(node.icon).toEqual(iconName);
		expect(node.getAttribute('icon')).toBe(iconName);

		// Should not have sent query to API yet
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.status).toBe('loading');

		// Wait until status changes
		expect(node.status).toBe('loading');
		await awaitUntil(() => node.status !== 'loading');

		// Should fail to render
		expect(node._shadowRoot.innerHTML).toBe(
			`${styleOpeningTag}${expectedBlock}</style>`
		);
		expect(node.status).toBe('failed');
	});
});
