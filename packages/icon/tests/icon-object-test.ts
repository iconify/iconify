import { testIconObject } from '../src/attributes/icon/object';
import { iconDefaults } from '@iconify/utils/lib/icon';

describe('Testing testIconObject', () => {
	it('Objects', () => {
		expect(
			testIconObject({
				body: '<g />',
			})
		).toEqual({
			...iconDefaults,
			body: '<g />',
		});

		expect(
			testIconObject({
				body: '<g />',
				width: 24,
				height: '32',
			})
		).toEqual({
			...iconDefaults,
			body: '<g />',
			width: 24,
			// Validation is simple, this will fail during render
			height: '32',
		});

		// Invalid objects
		expect(testIconObject({})).toBeUndefined();
		expect(
			testIconObject([
				{
					body: '<g />',
				},
			])
		).toBeUndefined();
		expect(
			testIconObject({
				body: true,
			})
		).toBeUndefined();
	});

	it('String', () => {
		expect(
			testIconObject(
				JSON.stringify({
					body: '<g />',
				})
			)
		).toEqual({
			...iconDefaults,
			body: '<g />',
		});

		// Strings that are not objects
		expect(testIconObject('foo')).toBeUndefined();
		expect(testIconObject('{"body": "<g />"')).toBeUndefined();
	});
});
