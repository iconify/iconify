import { minifyIconSet } from '@iconify/utils/lib/icon-set/minify';

describe('Testing minifying icon set', () => {
	it('Nothing to minify', () => {
		const item = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					height: 24,
				},
			},
		};
		const expected = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					height: 24,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	it('No common values', () => {
		const item = {
			prefix: 'foo',
			icons: {
				'foo-24': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-16': {
					body: '<g />',
					width: 12,
					height: 12,
				},
			},
		};
		const expected = {
			prefix: 'foo',
			icons: {
				'foo-24': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-16': {
					body: '<g />',
					width: 12,
					height: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	it('Default values', () => {
		const item = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					// Height matches default
					height: 16,
				},
				bar: {
					body: '<g />',
					// Width matches default
					width: 16,
					height: 12,
				},
			},
		};
		const expected = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
				},
				bar: {
					body: '<g />',
					height: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	it('Common value', () => {
		const item = {
			prefix: 'foo',
			icons: {
				// 2 icons have the same height, 2 icons have the same width
				'foo-wide': {
					body: '<g />',
					width: 32,
					height: 24,
				},
				'foo-square': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-tiny-wide': {
					body: '<g />',
					width: 24,
					height: 16,
				},
				'foo-tiny-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
			},
		};
		const expected = {
			prefix: 'foo',
			icons: {
				'foo-wide': {
					body: '<g />',
					width: 32,
				},
				'foo-square': {
					body: '<g />',
				},
				'foo-tiny-wide': {
					body: '<g />',
					height: 16,
				},
				'foo-tiny-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
			},
			width: 24,
			height: 24,
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	it('Common value that matches default', () => {
		const item = {
			prefix: 'foo',
			icons: {
				// 2 icons have the same height of 16, which is default value
				'foo-wide': {
					body: '<g />',
					width: 24,
					height: 16,
				},
				'foo-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
				'foo-tiny': {
					body: '<g />',
					width: 12,
					height: 16,
				},
			},
		};
		const expected = {
			prefix: 'foo',
			icons: {
				'foo-wide': {
					body: '<g />',
					width: 24,
				},
				'foo-square': {
					body: '<g />',
					// Should not have width because it matches default value
				},
				'foo-tiny': {
					body: '<g />',
					width: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});
});
