import 'mocha';
import { expect } from 'chai';
import { getIcons } from '../lib/icon-set/get-icons';
import type { IconifyJSON } from '@iconify/types';

describe('Testing retrieving icons from icon set', () => {
	it('Simple icon set', () => {
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
		expect(getIcons(data, ['missing-icon'])).to.be.eql(null);

		expect(getIcons(data, ['missing-icon'], true)).to.be.eql({
			prefix: 'foo',
			icons: {},
			not_found: ['missing-icon'],
		});

		// Icon
		expect(getIcons(data, ['bar'])).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
			},
		});

		// Same icon multiple times
		expect(getIcons(data, ['bar', 'bar', 'bar'])).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g id="bar" />',
				},
			},
		});

		// Mutliple icons
		expect(getIcons(data, ['foo', 'bar'])).to.be.eql({
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

	it('Aliases and characters', () => {
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
		expect(getIcons(data, ['foo'])).to.be.eql({
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
		expect(getIcons(data, ['foo2'])).to.be.eql({
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
		expect(getIcons(data, ['missing-alias'])).to.be.equal(null);
		expect(getIcons(data, ['missing-alias'], true)).to.be.eql({
			prefix: 'foo',
			icons: {},
			not_found: ['missing-alias'],
		});

		// Character
		expect(getIcons(data, ['f00'])).to.be.eql({
			prefix: 'foo',
			icons: {
				bar2: {
					body: '<g />',
				},
			},
			aliases: {
				f00: {
					parent: 'bar2',
				},
			},
		});

		// Character that points to alias
		expect(getIcons(data, ['f02'])).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			aliases: {
				f02: {
					parent: 'foo',
				},
				foo: {
					parent: 'bar',
					hFlip: true,
				},
			},
		});

		// Bad character
		expect(getIcons(data, ['f04'])).to.be.equal(null);
		expect(getIcons(data, ['f04'], true)).to.be.eql({
			prefix: 'foo',
			icons: {},
			not_found: ['f04'],
		});
	});
});
