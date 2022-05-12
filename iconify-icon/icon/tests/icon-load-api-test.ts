import { fakeAPI, nextPrefix, mockAPIData } from './helpers';
import { iconDefaults } from '@iconify/utils/lib/icon';
import { addCollection } from '@iconify/core/lib/storage/functions';
import { parseIconValue } from '../src/attributes/icon/index';

describe('Testing parseIconValue with API', () => {
	it('Loading icon from API', (done) => {
		// Set config
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

		// Mock data
		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;

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
		});

		// Test
		let callbackCalled = false;
		const result = parseIconValue(iconName, (value, icon, data) => {
			expect(callbackCalled).toBe(false);
			callbackCalled = true;

			expect(value).toBe(iconName);
			expect(icon).toEqual({
				provider,
				prefix,
				name,
			});
			expect(data).toEqual({
				...iconDefaults,
				body: '<g />',
			});

			done();
		});
		expect(result.loading).toBeDefined();
		expect(result).toEqual({
			value: iconName,
			name: {
				provider,
				prefix,
				name,
			},
			loading: result.loading,
		});
		expect(callbackCalled).toBe(false);
	});

	it('Already exists', (done) => {
		// Set config
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;

		addCollection(
			{
				prefix,
				icons: {
					[name]: {
						body: '<g id="test" />',
					},
				},
			},
			provider
		);

		// Mock data
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
			delay: () => {
				done('This function should not have been called');
			},
		});

		// Test
		const result = parseIconValue(iconName, () => {
			done('Callback should not have been called');
		});
		expect(result).toEqual({
			value: iconName,
			name: {
				provider,
				prefix,
				name,
			},
			data: {
				...iconDefaults,
				body: '<g id="test" />',
			},
		});
		done();
	});

	it('Failing to load', (done) => {
		// Set config
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

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

		// Test
		let callbackCalled = false;
		const result = parseIconValue(iconName, (value, icon, data) => {
			expect(callbackCalled).toBe(false);
			callbackCalled = true;

			expect(value).toBe(iconName);
			expect(icon).toEqual({
				provider,
				prefix,
				name,
			});
			expect(data).toBeFalsy();

			done();
		});
		expect(result.loading).toBeDefined();
		expect(result).toEqual({
			value: iconName,
			name: {
				provider,
				prefix,
				name,
			},
			loading: result.loading,
		});
		expect(callbackCalled).toBe(false);
	});

	it('Already marked as missing', (done) => {
		// Set config
		const provider = nextPrefix();
		const prefix = nextPrefix();
		fakeAPI(provider);

		const name = 'mock-test';
		const iconName = `@${provider}:${prefix}:${name}`;

		addCollection(
			{
				prefix,
				icons: {},
				not_found: [name],
			},
			provider
		);

		// Mock data
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
			delay: () => {
				done('This function should not have been called');
			},
		});

		// Test
		const result = parseIconValue(iconName, () => {
			done('Callback should not have been called');
		});
		expect(result).toEqual({
			value: iconName,
			name: {
				provider,
				prefix,
				name,
			},
			data: null,
		});
		done();
	});
});
