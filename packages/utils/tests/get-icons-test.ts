import type { IconifyJSON } from '@iconify/types';
import { getIcons } from '../lib/icon-set/get-icons';

describe('Testing retrieving icons from icon set', () => {
	test('Simple icon set', () => {
		const data: IconifyJSON = {
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
				baz: {
					body: '<g id="baz" />',
				},
				foo: {
					body: '<g id="foo" />',
				},
			},
		};

		// Missing icon
		expect(getIcons(data, ['missing-icon'])).toBeNull();

		expect(getIcons(data, ['missing-icon'], true)).toEqual({
			prefix: 'foo',
			icons: {},
			not_found: ['missing-icon'],
		});

		// Icon
		expect(getIcons(data, ['bar'])).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
			},
		});

		// Same icon multiple times
		expect(getIcons(data, ['bar', 'bar', 'bar'])).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
			},
		});

		// Mutliple icons
		expect(getIcons(data, ['foo', 'bar'])).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
				foo: {
					body: '<g id="foo" />',
				},
			},
		});
	});

	test('Aliases and characters', () => {
		const data: IconifyJSON = {
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
				bar2: {
					body: '<g />',
				},
			},
			aliases: {
				'foo': {
					parent: 'bar',
					hFlip: true,
				},
				'foo2': {
					parent: 'foo',
				},
				'missing-alias': {
					parent: 'missing-icon',
				},
			},
			chars: {
				f00: 'bar2',
				f01: 'bar',
				f02: 'foo',
				f03: 'foo2',
				f04: 'missing-icon',
			},
		};

		// Alias
		expect(getIcons(data, ['foo'])).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			aliases: {
				foo: {
					parent: 'bar',
					hFlip: true,
				},
			},
		});

		// Alias of alias
		expect(getIcons(data, ['foo2'])).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			aliases: {
				foo: {
					parent: 'bar',
					hFlip: true,
				},
				foo2: {
					parent: 'foo',
				},
			},
		});

		// Bad alias
		expect(getIcons(data, ['missing-alias'])).toBeNull();
		expect(getIcons(data, ['missing-alias'], true)).toEqual({
			prefix: 'foo',
			icons: {},
			not_found: ['missing-alias'],
		});

		// Character
		expect(getIcons(data, ['f00'])).toBeNull();

		// Character that points to alias
		expect(getIcons(data, ['f02'])).toBeNull();

		// Bad character
		expect(getIcons(data, ['f04'])).toBeNull();
		expect(getIcons(data, ['f04'], true)).toEqual({
			prefix: 'foo',
			icons: {},
			not_found: ['f04'],
		});
	});
});
