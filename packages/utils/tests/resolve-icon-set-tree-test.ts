import { getIconsTree } from '../lib/icon-set/tree';

describe('Testing getIconsTree', () => {
	test('Simple icon set', () => {
		const body = '<g />';
		const tree = getIconsTree({
			prefix: 'foo',
			icons: {
				foo: {
					body,
				},
				bar: {
					body,
				},
			},
			aliases: {
				baz: {
					parent: 'bar',
				},
			},
		});
		expect(tree).toEqual({
			foo: [],
			bar: [],
			baz: ['bar'],
		});
	});

	test('Long chain of aliases, bad aliases', () => {
		const body = '<g />';
		const tree = getIconsTree({
			prefix: 'foo',
			icons: {
				foo: {
					body,
				},
				bar: {
					body,
				},
			},
			aliases: {
				baz: {
					parent: 'bar',
				},
				// Will be parsed before parent
				baz2: {
					parent: 'baz3',
				},
				// Will be parsed when already resolved
				baz3: {
					parent: 'baz',
				},
				baz4: {
					parent: 'baz3',
				},
				baz5: {
					parent: 'baz4',
				},
				baz6: {
					parent: 'baz5',
				},
				bazz5: {
					parent: 'baz4',
					hFlip: true,
				},
				// Bad alias
				bad: {
					parent: 'good',
				},
				// Loop
				loop1: {
					parent: 'loop3',
				},
				loop2: {
					parent: 'loop1',
				},
				loop3: {
					parent: 'loop1',
				},
			},
		});
		expect(tree).toEqual({
			foo: [],
			bar: [],
			baz: ['bar'],
			baz2: ['baz3', 'baz', 'bar'],
			baz3: ['baz', 'bar'],
			baz4: ['baz3', 'baz', 'bar'],
			baz5: ['baz4', 'baz3', 'baz', 'bar'],
			baz6: ['baz5', 'baz4', 'baz3', 'baz', 'bar'],
			bazz5: ['baz4', 'baz3', 'baz', 'bar'],
			good: null,
			bad: null,
			loop1: null,
			loop2: null,
			loop3: null,
		});
	});
});
