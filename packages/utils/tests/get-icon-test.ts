import { getIconData } from '../lib/icon-set/get-icon';

describe('Testing getting icon data', () => {
	test('Simple icon', () => {
		const result = getIconData(
			{
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
						width: 24,
					},
				},
			},
			'bar'
		);
		expect(result).toEqual({
			body: '<g />',
			width: 24,
		});
	});

	test('Minified icon set', () => {
		const result = getIconData(
			{
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				width: 24,
				height: 24,
			},
			'bar'
		);
		expect(result).toEqual({
			body: '<g />',
			width: 24,
			height: 24,
		});
	});
});
