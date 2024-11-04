import { parseIconValue } from '../src/attributes/icon/index';

describe('Testing parseIconValue without API', () => {
	it('Instantly loading object', () => {
		const value = {
			body: '<g />',
		};
		const result = parseIconValue(value, () => {
			throw new Error('callback should not have been called');
		});
		expect(result).toEqual({
			value,
			data: value,
		});
		expect(result.value).toBe(value);
	});

	it('Instantly loading serialised object', () => {
		const value = JSON.stringify({
			body: '<g />',
		});
		const result = parseIconValue(value, () => {
			throw new Error('callback should not have been called');
		});
		expect(result).toEqual({
			value,
			data: {
				body: '<g />',
			},
		});
	});

	it('Bad data', () => {
		const value = '<svg />';
		const result = parseIconValue(value, () => {
			throw new Error('callback should not have been called');
		});
		expect(result).toEqual({
			value,
			name: {
				provider: '',
				prefix: '',
				name: value,
			},
		});
	});

	it('Icon without prefix', () => {
		const value = 'Test';
		const result = parseIconValue(value, () => {
			throw new Error('callback should not have been called');
		});
		expect(result).toEqual({
			value,
			name: {
				provider: '',
				prefix: '',
				name: value,
			},
		});
	});
});
