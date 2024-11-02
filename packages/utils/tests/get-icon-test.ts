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
				prefix: 'test_set',
				icons: {
					test_icon: {
						body: '<g />',
					},
				},
				width: 24,
				height: 24,
			},
			'test_icon'
		);
		expect(result).toEqual({
			body: '<g />',
			width: 24,
			height: 24,
		});
	});

	test('Alias', () => {
		const result = getIconData(
			{
				prefix: 'test_set',
				icons: {
					test_icon: {
						body: '<g />',
					},
				},
				aliases: {
					test_alias: {
						parent: 'test_icon',
						rotate: 2,
					},
				},
				width: 24,
				height: 24,
			},
			'test_alias'
		);
		expect(result).toEqual({
			body: '<g />',
			width: 24,
			height: 24,
			rotate: 2,
		});
	});
});
