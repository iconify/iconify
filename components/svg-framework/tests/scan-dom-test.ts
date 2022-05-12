import { iconExists, addIcon } from '@iconify/core/lib/storage/functions';
import {
	fakeAPI,
	nextPrefix,
	setupDOM,
	waitDOMReady,
	resetState,
	mockAPIData,
	awaitUntil,
} from './helpers';
import { addBodyNode } from '../src/observer/root';
import { scanDOM } from '../src/scanner/index';
import { elementDataProperty } from '../src/scanner/config';

describe('Scanning DOM', () => {
	const provider = nextPrefix();

	beforeAll(() => {
		fakeAPI(provider);
	});

	afterEach(resetState);

	it('Rendering preloaded icon', async () => {
		const prefix = nextPrefix();
		const iconName = `@${provider}:${prefix}:home`;

		// Add icon
		expect(iconExists(iconName)).toBe(false);
		addIcon(iconName, {
			body: '<g />',
		});
		expect(iconExists(iconName)).toBe(true);

		// Setup DOM and wait for it to be ready
		setupDOM(`<span class="iconify" data-icon="${iconName}"></span>`);
		await waitDOMReady();

		// Observe body
		addBodyNode();

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		const placeholder = document.body.childNodes[0];
		expect(placeholder[elementDataProperty]).toBeUndefined();

		// Scan DOM
		scanDOM();

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" class="iconify iconify--${provider} iconify--${prefix}"><g></g></svg>`
		);
		const svg = document.body.childNodes[0];
		const svgData = svg[elementDataProperty];
		expect(svgData.status).toBe('loaded');
		expect(svgData.name).toEqual(iconName);
	});

	it('Loading icon', async () => {
		const prefix = nextPrefix();
		const iconName = `@${provider}:${prefix}:home`;

		// Add icon with API
		expect(iconExists(iconName)).toBe(false);
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					home: {
						body: '<g />',
					},
				},
			},
		});

		// Setup DOM and wait for it to be ready
		setupDOM(`<span class="iconify" data-icon="${iconName}"></span>`);
		await waitDOMReady();

		// Observe body
		addBodyNode();

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		const placeholder = document.body.childNodes[0];
		expect(placeholder[elementDataProperty]).toBeUndefined();

		// Scan DOM
		scanDOM();

		// Check HTML again
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		expect(placeholder).toBe(document.body.childNodes[0]);
		const placeholderData = placeholder[elementDataProperty];
		expect(placeholderData.status).toBe('loading');
		expect(placeholderData.name).toEqual(iconName);

		// Wait for re-render
		await awaitUntil(() => document.body.childNodes[0] !== placeholder);

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" class="iconify iconify--${provider} iconify--${prefix}"><g></g></svg>`
		);
		const svg = document.body.childNodes[0];
		const svgData = svg[elementDataProperty];
		expect(svgData.status).toBe('loaded');
		expect(svgData.name).toEqual(iconName);
	});

	it('Missing icon', async () => {
		const prefix = nextPrefix();
		const iconName = `@${provider}:${prefix}:home`;

		// Add icon with API
		expect(iconExists(iconName)).toBe(false);
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {},
				not_found: ['home'],
			},
		});

		// Setup DOM and wait for it to be ready
		setupDOM(`<span class="iconify" data-icon="${iconName}"></span>`);
		await waitDOMReady();

		// Observe body
		addBodyNode();

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		const placeholder = document.body.childNodes[0];
		expect(placeholder[elementDataProperty]).toBeUndefined();

		// Scan DOM
		scanDOM();

		// Check HTML again
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		expect(placeholder).toBe(document.body.childNodes[0]);
		const placeholderData = placeholder[elementDataProperty];
		expect(placeholderData.status).toBe('loading');
		expect(placeholderData.name).toEqual(iconName);

		// Wait for re-render
		await awaitUntil(() => placeholderData.status === 'missing');

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
	});
});
