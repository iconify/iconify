import 'mocha';
import { expect } from 'chai';
import type { IconifyJSON } from '@iconify/types';
import { parseIconSet } from '../lib/icon-set/parse';
import type { FullIconifyIcon } from '../lib/icon';

describe('Testing parsing icon set', () => {
	it('Simple icon set', () => {
		// Names list
		const names: string[] = ['missing', 'icon1', 'icon2'];

		// Resolved data
		const expected: Record<string, FullIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			missing: null,
		};

		// Do stuff
		expect(
			parseIconSet(
				{
					prefix: 'foo',
					not_found: ['missing'],
					icons: {
						icon1: {
							body: '<path d="icon1" />',
							width: 20,
						},
						icon2: {
							body: '<path d="icon2" />',
							width: 24,
						},
					},
					height: 24,
				},
				(name, data) => {
					// Make sure name matches
					expect(names.length).to.be.at.least(1);
					expect(name).to.be.equal(names.shift());

					// Check icon data
					expect(data).to.be.eql(expected[name]);
				}
			)
		).to.be.equal(true);

		// All names should have been parsed
		expect(names).to.be.eql([], 'Not all icons have been parsed');
	});

	it('Aliases', () => {
		// Names list
		const names: string[] = ['icon1', 'icon2', 'alias1', 'alias2'];
		const namesCopy = names.slice(0);

		// Resolved data
		const expected: Record<string, FullIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: true,
				rotate: 3,
			},
			alias1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			alias2: {
				body: '<path d="icon2" />',
				width: 20,
				height: 24,
				top: 0,
				left: 0,
				hFlip: true,
				vFlip: true,
				rotate: 3,
			},
		};

		// Do stuff
		expect(
			parseIconSet(
				{
					prefix: 'foo',
					icons: {
						icon1: {
							body: '<path d="icon1" />',
							width: 20,
						},
						icon2: {
							body: '<path d="icon2" />',
							width: 24,
							vFlip: true,
							rotate: 3,
						},
					},
					aliases: {
						alias1: {
							parent: 'icon1',
						},
						alias2: {
							parent: 'icon2',
							hFlip: true,
							width: 20,
						},
					},
					height: 24,
				},
				(name, data) => {
					// Make sure name matches
					expect(names.length).to.be.at.least(1);
					expect(name).to.be.equal(names.shift());

					// Check icon data
					expect(data).to.be.eql(expected[name]);
				},
				'all'
			)
		).to.be.eql(namesCopy);

		// All names should have been parsed
		expect(names).to.be.eql([], 'Not all icons have been parsed');
	});

	it('Nested aliases', () => {
		// Names list
		const names: string[] = [
			'icon1',
			'icon2',
			'alias2a',
			'alias2f',
			'alias2z',
			'alias2z3',
		];
		const namesCopy = names.slice(0);

		// Resolved data
		const expected: Record<string, FullIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 20,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				top: 0,
				left: 0,
				hFlip: true,
				vFlip: false,
				rotate: 1,
			},
			alias2f: {
				// icon2 + alias2f
				body: '<path d="icon2" />',
				width: 22,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: true,
				rotate: 2,
			},
			alias2a: {
				// icon2 + alias2f + alias2a
				body: '<path d="icon2" />',
				width: 20,
				height: 20,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: true,
				rotate: 2,
			},
			alias2z: {
				// icon2 + alias2f + alias2z
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: true,
				rotate: 1,
			},
			alias2z3: {
				// icon2 + alias2f + alias2z
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: true,
				rotate: 1,
			},
		};

		// Do stuff
		expect(
			parseIconSet(
				{
					prefix: 'foo',
					icons: {
						icon1: {
							body: '<path d="icon1" />',
							width: 20,
							height: 20,
						},
						icon2: {
							body: '<path d="icon2" />',
							width: 24,
							rotate: 1,
							hFlip: true,
						},
					},
					aliases: {
						alias2a: {
							// Alias before parent
							parent: 'alias2f',
							width: 20,
							height: 20,
						},
						alias2f: {
							parent: 'icon2',
							width: 22,
							rotate: 1,
							hFlip: true,
							vFlip: true,
						},
						alias2z: {
							// Alias after parent
							parent: 'alias2f',
							width: 21,
							rotate: 3,
						},
						alias2z3: {
							// 3 parents: alias2z, alias2f, icon2
							parent: 'alias2z',
						},
						alias2z4: {
							// 4 parents: alias2z3, alias2z, alias2f, icon2
							// nesting is too deep and should not be parsed
							parent: 'alias2z3',
						},
						alias3: {
							// invalid parent
							parent: 'icon3',
						},
					},
					height: 24,
				},
				(name, data) => {
					// Make sure name matches
					expect(names.length).to.be.at.least(
						1,
						`Unexpected icon ${name}`
					);
					expect(name).to.be.equal(
						names.shift(),
						`Expected icon ${name} to be next`
					);

					// Check icon data
					expect(data).to.be.eql(
						expected[name],
						`Invalid data for ${name}`
					);
				},
				'added'
			)
		).to.be.eql(namesCopy);

		// All names should have been parsed
		expect(names).to.be.eql([], 'Not all icons have been parsed');
	});

	it('Invalid default values', () => {
		// Names list
		const names: string[] = ['icon1', 'icon2'];
		const namesCopy = names.slice(0);

		// Resolved data
		const expected: Record<string, FullIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 20,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				top: 0,
				left: 0,
				hFlip: false,
				vFlip: false,
				rotate: 0,
			},
		};

		const iconSet: IconifyJSON = {
			icons: {
				icon1: {
					body: '<path d="icon1" />',
					width: 20,
					// Default should not override this
					height: 20,
				},
				icon2: {
					body: '<path d="icon2" />',
					width: 24,
				},
				icon3: {
					// Missing 'body'
					width: 24,
				},
			},
			height: 24,
			// Objects should be ignored. Not testing other types because validation is done only for objects
			rotate: {
				foo: 1,
			},
			hFlip: null,
		} as unknown as IconifyJSON;

		// Do stuff
		expect(
			parseIconSet(
				iconSet,
				(name, data) => {
					// Make sure name matches
					expect(names.length).to.be.at.least(1);
					expect(name).to.be.equal(names.shift());

					// Check icon data
					expect(data).to.be.eql(expected[name]);
				},
				'all'
			)
		).to.be.eql(namesCopy);

		// All names should have been parsed
		expect(names).to.be.eql([], 'Not all icons have been parsed');
	});
});
