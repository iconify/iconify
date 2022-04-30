import { iconExists } from '@iconify/core/lib/storage/functions';
import {
	fakeAPI,
	nextPrefix,
	setupDOM,
	waitDOMReady,
	resetState,
	mockAPIData,
	awaitUntil,
	nextTick,
} from './helpers';
import { addBodyNode } from '../src/observer/root';
import { scanDOM } from '../src/scanner/index';
import { elementDataProperty } from '../src/scanner/config';
import { initObserver } from '../src/observer';

describe('Observing DOM changes', () => {
	const provider = nextPrefix();

	beforeAll(() => {
		fakeAPI(provider);
	});

	afterEach(resetState);

	it('Loading icon, transforming icon', async () => {
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
		initObserver(scanDOM);

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);

		// Wait for re-render
		const placeholder = document.body.childNodes[0];
		await awaitUntil(() => document.body.childNodes[0] !== placeholder);

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" class="iconify iconify--${provider} iconify--${prefix}"><g></g></svg>`
		);
		const svg = document.body.childNodes[0] as SVGSVGElement;
		const svgData = svg[elementDataProperty];
		expect(svgData.status).toBe('loaded');
		expect(svgData.name).toEqual(iconName);

		// Rotate icon
		svg.setAttribute('data-rotate', '90deg');

		// Wait for re-render
		await awaitUntil(
			() => document.body.innerHTML.indexOf('transform=') !== -1
		);
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" data-rotate="90deg" class="iconify iconify--${provider} iconify--${prefix}"><g transform="rotate(90 8 8)"><g></g></g></svg>`
		);
	});

	it('Changing icon name after rendering first icon', async () => {
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();
		const iconName = `@${provider}:${prefix1}:home`;
		const iconName2 = `@${provider}:${prefix2}:arrow`;
		let sendSecondIcon = null;

		// Add icon with API
		expect(iconExists(iconName)).toBe(false);
		expect(iconExists(iconName2)).toBe(false);
		mockAPIData({
			type: 'icons',
			provider,
			prefix: prefix1,
			response: {
				prefix: prefix1,
				icons: {
					home: {
						body: '<g />',
					},
				},
			},
		});
		mockAPIData({
			type: 'icons',
			provider,
			prefix: prefix2,
			response: {
				prefix: prefix2,
				icons: {
					arrow: {
						body: '<path d="M0 0v2" />',
						width: 24,
						height: 24,
					},
				},
			},
			delay: (send) => {
				sendSecondIcon = send;
			},
		});

		// Setup DOM and wait for it to be ready
		setupDOM(`<span class="iconify" data-icon="${iconName}"></span>`);
		await waitDOMReady();

		// Observe body
		addBodyNode();
		initObserver(scanDOM);

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);

		// Wait for re-render
		const placeholder = document.body.childNodes[0];
		await awaitUntil(() => document.body.childNodes[0] !== placeholder);

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" class="iconify iconify--${provider} iconify--${prefix1}"><g></g></svg>`
		);
		const svg = document.body.childNodes[0] as SVGSVGElement;
		const svgData = svg[elementDataProperty];
		expect(svgData.status).toBe('loaded');
		expect(svgData.name).toEqual(iconName);

		// Chang icon name
		svg.setAttribute('data-icon', iconName2);

		// Wait for DOM to be scanned again and API query to be sent
		await awaitUntil(() => sendSecondIcon !== null);

		// SVG should not have been replaced yet, but data should match new icon
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName2}" class="iconify iconify--${provider} iconify--${prefix1}"><g></g></svg>`
		);
		expect(document.body.childNodes[0]).toBe(svg);
		expect(svgData.status).toBe('loading');
		expect(svgData.name).toEqual(iconName2);

		// Send API query
		sendSecondIcon();

		// Wait for re-render
		await awaitUntil(
			() => document.body.innerHTML.indexOf('M0 0v2') !== -1
		);

		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="${iconName2}" class="iconify iconify--${provider} iconify--${prefix2}"><path d="M0 0v2"></path></svg>`
		);
	});

	it('Changing icon name while loading first icon', async () => {
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();
		const iconName = `@${provider}:${prefix1}:home`;
		const iconName2 = `@${provider}:${prefix2}:arrow`;
		let sendFirstIcon = null;
		let sendSecondIcon = null;

		// Add icon with API
		expect(iconExists(iconName)).toBe(false);
		expect(iconExists(iconName2)).toBe(false);
		mockAPIData({
			type: 'icons',
			provider,
			prefix: prefix1,
			response: {
				prefix: prefix1,
				icons: {
					home: {
						body: '<g />',
					},
				},
			},
			delay: (send) => {
				sendFirstIcon = send;
			},
		});
		mockAPIData({
			type: 'icons',
			provider,
			prefix: prefix2,
			response: {
				prefix: prefix2,
				icons: {
					arrow: {
						body: '<path d="M0 0v2" />',
						width: 24,
						height: 24,
					},
				},
			},
			delay: (send) => {
				sendSecondIcon = send;
			},
		});

		// Setup DOM and wait for it to be ready
		setupDOM(`<span class="iconify" data-icon="${iconName}"></span>`);
		await waitDOMReady();

		// Observe body
		addBodyNode();
		initObserver(scanDOM);

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);

		// Wait for DOM to be scanned again and API query to be sent
		await awaitUntil(() => sendFirstIcon !== null);

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}"></span>`
		);
		const placeholder = document.body.childNodes[0] as HTMLSpanElement;
		const placeholderData = placeholder[elementDataProperty];
		expect(placeholderData.status).toBe('loading');
		expect(placeholderData.name).toEqual(iconName);

		// Chang icon name
		placeholder.setAttribute('data-icon', iconName2);

		// Wait for DOM to be scanned again and API query to be sent
		await awaitUntil(() => sendSecondIcon !== null);

		// SVG should not have been rendered yet, but data should match new icon
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName2}"></span>`
		);
		expect(document.body.childNodes[0]).toBe(placeholder);
		expect(placeholderData.status).toBe('loading');
		expect(placeholderData.name).toEqual(iconName2);

		// Send first API query
		sendFirstIcon();
		await awaitUntil(() => iconExists(iconName));

		// Wait a bit more
		await nextTick([0, 0, 0]);

		// Nothing should have changed
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName2}"></span>`
		);
		expect(document.body.childNodes[0]).toBe(placeholder);
		expect(placeholderData.status).toBe('loading');
		expect(placeholderData.name).toEqual(iconName2);

		// Send second API query
		sendSecondIcon();

		// Wait for re-render
		await awaitUntil(
			() => document.body.innerHTML.indexOf('M0 0v2') !== -1
		);

		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="${iconName2}" class="iconify iconify--${provider} iconify--${prefix2}"><path d="M0 0v2"></path></svg>`
		);
	});
});
