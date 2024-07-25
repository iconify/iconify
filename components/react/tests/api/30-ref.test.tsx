import React from 'react';
import { Icon, InlineIcon, loadIcons, iconExists } from '../../dist/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Testing references', () => {
	test('reference for preloaded icon', () => {
		return new Promise((resolve) => {
			const prefix = nextPrefix();
			const name = 'render-test';
			const iconName = `@${provider}:${prefix}:${name}`;

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: iconData,
					},
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Load icon
			loadIcons([iconName], (loaded, missing, pending) => {
				let gotRef = false;
				let gotInlineRef = false;

				// Make sure icon has been loaded
				expect(loaded).toMatchObject([
					{
						provider,
						prefix,
						name,
					},
				]);
				expect(missing).toMatchObject([]);
				expect(pending).toMatchObject([]);
				expect(iconExists(iconName)).toEqual(true);

				// Render components
				render(
					<Icon
						icon={iconName}
						ref={(element) => {
							gotRef = true;
						}}
					/>
				);

				render(
					<InlineIcon
						icon={iconName}
						ref={(element) => {
							gotInlineRef = true;
						}}
					/>
				);

				// References should be called immediately in test
				expect(gotRef).toEqual(true);
				expect(gotInlineRef).toEqual(true);

				resolve(true);
			});
		});
	});

	test('reference to pending icon', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'mock-test';
			const iconName = `@${provider}:${prefix}:${name}`;
			let gotRef = false;

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: iconData,
					},
				},
				delay: (next) => {
					// Icon should not have loaded yet
					expect(iconExists(iconName)).toEqual(false);

					// Reference should not have been called yet
					expect(gotRef).toEqual(false);

					// Send icon data
					next();

					// Test it again
					expect(iconExists(iconName)).toEqual(true);
					expect(gotRef).toEqual(false);

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						if (!gotRef) {
							// Test again
							if (counter > 5) {
								clearInterval(timer);
								reject(new Error('Icon reference was not set'));
							}
							return;
						}

						// Success!
						clearInterval(timer);
						resolve(true);
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			render(
				<Icon
					icon={iconName}
					ref={(element) => {
						gotRef = true;
					}}
				/>
			);

			// Reference should not have been called yet
			expect(gotRef).toEqual(false);
		});
	});

	test('missing icon', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'missing-icon';
			const iconName = `@${provider}:${prefix}:${name}`;
			let gotRef = false;

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: 404,
				delay: (next) => {
					// Icon should not have loaded yet
					expect(iconExists(iconName)).toEqual(false);

					// Reference should not have been called
					expect(gotRef).toEqual(false);

					// Send icon data
					next();

					// Test it again
					expect(iconExists(iconName)).toEqual(false);
					expect(gotRef).toEqual(false);

					// Check if state was changed in next few ticks
					let counter = 0;
					const timer = setInterval(() => {
						counter++;
						if (gotRef) {
							// Failed!
							clearInterval(timer);
							reject(new Error('Icon reference was set'));
							return;
						}

						if (counter > 5) {
							// Waited enough. Success
							clearInterval(timer);
							resolve(true);
						}
					});
				},
			});

			// Check if icon has been loaded
			expect(iconExists(iconName)).toEqual(false);

			// Render component
			render(
				<Icon
					icon={iconName}
					ref={(element) => {
						gotRef = true;
					}}
				></Icon>
			);

			// Reference should not have been called
			expect(gotRef).toEqual(false);
		});
	});
});
