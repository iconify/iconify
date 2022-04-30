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

describe('Changing render modes', () => {
	const provider = nextPrefix();

	beforeAll(() => {
		fakeAPI(provider);
	});

	afterEach(resetState);

	it('Various background modes', async () => {
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
		setupDOM(
			`<span class="iconify" data-icon="${iconName}" data-mode="style"></span>`
		);
		await waitDOMReady();

		// Observe body
		addBodyNode();
		initObserver(scanDOM);

		// Check HTML and data
		expect(document.body.innerHTML).toBe(
			`<span class="iconify" data-icon="${iconName}" data-mode="style"></span>`
		);

		// Wait for re-render
		const placeholder = document.body.childNodes[0] as HTMLSpanElement;
		const style = placeholder.style;

		await awaitUntil(() => !!style.getPropertyValue('--svg'));

		// Check HTML
		expect(document.body.innerHTML).toBe(
			`<span class="iconify iconify--${provider} iconify--${prefix}" data-icon="${iconName}" data-mode="style" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></span>`
		);

		let data = placeholder[elementDataProperty];
		expect(data.addedStyles.indexOf('background-image') !== -1).toBe(true);
		expect(data.addedStyles.indexOf('mask-image') !== -1).toBe(false);
		expect(style.getPropertyValue('mask-image')).toBe('');

		// Render as mask
		placeholder.setAttribute('data-mode', 'mask');
		await awaitUntil(() => !!style.getPropertyValue('mask-image'));
		expect(document.body.innerHTML).toBe(
			`<span class="iconify iconify--${provider} iconify--${prefix}" data-icon="${iconName}" data-mode="mask" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: currentColor; mask-image: var(--svg); mask-repeat: no-repeat; mask-size: 100% 100%;"></span>`
		);

		data = placeholder[elementDataProperty];
		expect(data.addedStyles.indexOf('background-image') !== -1).toBe(false);
		expect(data.addedStyles.indexOf('mask-image') !== -1).toBe(true);
		expect(style.getPropertyValue('background-image')).toBe('');

		// Re-render as background
		placeholder.setAttribute('data-mode', 'bg');
		await awaitUntil(() => !style.getPropertyValue('mask-image'));
		expect(document.body.innerHTML).toBe(
			`<span class="iconify iconify--${provider} iconify--${prefix}" data-icon="${iconName}" data-mode="bg" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></span>`
		);

		data = placeholder[elementDataProperty];
		expect(data.addedStyles.indexOf('background-image') !== -1).toBe(true);
		expect(data.addedStyles.indexOf('mask-image') !== -1).toBe(false);
		expect(style.getPropertyValue('mask-image')).toBe('');

		// Re-render as SVG
		placeholder.setAttribute('data-mode', 'inline');
		await awaitUntil(() => document.body.childNodes[0] !== placeholder);
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" data-mode="inline" style="" class="iconify iconify--${provider} iconify--${prefix}"><g></g></svg>`
		);
		const svgData = document.body.childNodes[0][elementDataProperty];
		expect(svgData.mode).toBe('inline');

		// Change to style (should not work!)
		placeholder.setAttribute('data-mode', 'bg');
		await awaitUntil(() => svgData.mode !== 'bg');
		expect(document.body.innerHTML).toBe(
			`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 16 16" data-icon="${iconName}" data-mode="inline" style="" class="iconify iconify--${provider} iconify--${prefix}"><g></g></svg>`
		);
	});
});
