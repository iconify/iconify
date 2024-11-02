import { quicklyValidateIconSet } from '../lib/icon-set/validate-basic';

describe('Testing validation', () => {
	test('Not object', () => {
		expect(quicklyValidateIconSet(void 0)).toBe(null);
		expect(quicklyValidateIconSet({})).toBe(null);
		expect(quicklyValidateIconSet(null)).toBe(null);
		expect(quicklyValidateIconSet([])).toBe(null);
	});

	test('Valid sets', () => {
		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				width: 24,
				height: 24,
			})
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			width: 24,
			height: 24,
		});

		expect(
			quicklyValidateIconSet({
				// Characters that used to be invalid
				prefix: 'fòó_bār',
				icons: {
					// Characters that used to be invalid
					bär: {
						body: '<g />',
						width: 32,
						height: 32,
						rotate: 0,
						hFlip: false,
						vFlip: true,
						// Legacy property
						verticalAlign: -0.14,
					},
				},
				aliases: {
					// Characters that used to be invalid
					Bär_Bāz: {
						parent: 'bär',
						hFlip: true,
					},
				},
				width: 24,
				height: 24,
			})
		).toEqual({
			prefix: 'fòó_bār',
			icons: {
				bär: {
					body: '<g />',
					width: 32,
					height: 32,
					rotate: 0,
					hFlip: false,
					vFlip: true,
					verticalAlign: -0.14,
				},
			},
			aliases: {
				Bär_Bāz: {
					parent: 'bär',
					hFlip: true,
				},
			},
			width: 24,
			height: 24,
		});

		// Empty is allowed
		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {},
			})
		).toEqual({
			prefix: 'foo',
			icons: {},
		});
	});

	test('Missing required properties', () => {
		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
			})
		).toBe(null);

		expect(
			quicklyValidateIconSet({
				icons: {},
			})
		).toBe(null);
	});

	test('Empty icon name', () => {
		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {
					'': {
						body: '<g />',
					},
				},
			})
		).toBe(null);
	});

	test('Invalid optional properties', () => {
		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
					},
				},
				height: 24,
				// Object
				width: {
					foo: 1,
				},
			})
		).toBe(null);

		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
					},
				},
				height: 24,
				// Object
				left: null,
			})
		).toBe(null);

		expect(
			quicklyValidateIconSet({
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
					},
				},
				height: 24,
				// String
				width: '32',
			})
		).toBe(null);
	});
});
