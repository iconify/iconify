import { fakeAPI, nextPrefix, mockAPIData } from '../src/tests/helpers';
import { addCollection } from '@iconify/core/lib/storage/functions';
import { parseIconValue } from '../src/attributes/icon/index';

describe('Testing parseIconValue with API', () => {
	it('Loading icon from API', () => {
		return new Promise((fulfill) => {
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
					body: '<g />',
				});

				fulfill(true);
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
	});

	it('Already exists', () => {
		return new Promise((fulfill, reject) => {
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
					reject('This function should not have been called');
				},
			});

			// Test
			const result = parseIconValue(iconName, () => {
				reject('Callback should not have been called');
			});
			expect(result).toEqual({
				value: iconName,
				name: {
					provider,
					prefix,
					name,
				},
				data: {
					body: '<g id="test" />',
				},
			});
			fulfill(true);
		});
	});

	it('Failing to load', () => {
		return new Promise((fulfill) => {
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

				fulfill(true);
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
	});

	it('Already marked as missing', () => {
		return new Promise((fulfill, reject) => {
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
					reject('This function should not have been called');
				},
			});

			// Test
			const result = parseIconValue(iconName, () => {
				reject('Callback should not have been called');
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
			fulfill(true);
		});
	});
});
