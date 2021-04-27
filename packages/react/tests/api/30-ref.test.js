import React from 'react';
import renderer from 'react-test-renderer';
import { Icon, InlineIcon, loadIcons, iconExists } from '../../lib/iconify';
import { mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { provider, nextPrefix } from './load';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Testing references', () => {
	test('reference for preloaded icon', (done) => {
		const prefix = nextPrefix();
		const name = 'render-test';
		const iconName = `@${provider}:${prefix}:${name}`;
		mockAPIData({
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
			renderer.create(
				<Icon
					icon={iconName}
					ref={(element) => {
						gotRef = true;
					}}
				/>
			);

			renderer.create(
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

			done();
		});
	});

	test('reference to pending icon', (done) => {
		const prefix = nextPrefix();
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;
		let gotRef = false;

		mockAPIData({
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

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks
				setTimeout(() => {
					setTimeout(() => {
						expect(gotRef).toEqual(true);

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		renderer.create(
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

	test('missing icon', (done) => {
		const prefix = nextPrefix();
		const name = 'missing-icon';
		const iconName = `@${provider}:${prefix}:${name}`;
		let gotRef = false;

		mockAPIData({
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

				// Check if state was changed
				// Wrapped in double setTimeout() because re-render takes 2 ticks
				setTimeout(() => {
					setTimeout(() => {
						// Reference should not have been called
						expect(gotRef).toEqual(false);

						done();
					}, 0);
				}, 0);
			},
		});

		// Check if icon has been loaded
		expect(iconExists(iconName)).toEqual(false);

		// Render component
		const component = renderer.create(
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
