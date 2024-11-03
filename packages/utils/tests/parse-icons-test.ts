import type { ExtendedIconifyIcon } from '@iconify/types';
import { parseIconSet, parseIconSetAsync } from '../lib/icon-set/parse';

describe('Testing parsing icon set', () => {
	test('Simple icon set', () => {
		// Names list
		const names: string[] = ['missing', 'icon_1', 'icon_2'];

		// Resolved data
		const expected: Record<string, ExtendedIconifyIcon | null> = {
			icon_1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
			},
			icon_2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
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
						icon_1: {
							body: '<path d="icon1" />',
							width: 20,
						},
						icon_2: {
							body: '<path d="icon2" />',
							width: 24,
						},
					},
					height: 24,
				},
				(name, data) => {
					// Make sure name matches
					expect(names.length).toBeGreaterThanOrEqual(1);
					expect(name).toBe(names.shift());

					// Check icon data
					expect(data).toEqual(expected[name]);
				}
			)
		).toEqual(['missing', 'icon_1', 'icon_2']);

		// All names should have been parsed
		expect(names).toEqual([]);
	});

	test('Aliases', () => {
		// Names list
		let names: string[] = ['icon1', 'icon2', 'alias1', 'alias2'];
		const expectedNames = names.slice(0).sort((a, b) => a.localeCompare(b));

		// Resolved data
		const expected: Record<string, ExtendedIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				vFlip: true,
				rotate: 3,
			},
			alias1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
			},
			alias2: {
				body: '<path d="icon2" />',
				width: 20,
				height: 24,
				hFlip: true,
				vFlip: true,
				rotate: 3,
			},
		};

		// Do stuff
		const parsedNames = parseIconSet(
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
					// invalid alias
					icon2: {
						parent: 'icon1',
					},
				},
				height: 24,
			},
			(name, data) => {
				// Make sure name exists in array of pending names
				const index = names.indexOf(name);
				expect(index).not.toBe(-1);
				names = names.slice(0, index).concat(names.slice(index + 1));

				// Check icon data
				expect(data).toEqual(expected[name]);
			}
		);

		// All names should have been parsed, not necessary in expected order
		expect(names).toEqual([]);
		parsedNames.sort((a, b) => a.localeCompare(b));
		expect(parsedNames).toEqual(expectedNames);
	});

	test('Nested aliases', async () => {
		// Names list
		let names: string[] = [
			'icon1',
			'icon2',
			'alias2a',
			'alias2f',
			'alias2z',
			'alias2z3',
			'alias2z4',
			'alias2z5',
			'alias2z6',
			'alias2z7',
		];
		const expectedNames = names.slice(0).sort((a, b) => a.localeCompare(b));

		// Resolved data
		const expected: Record<string, ExtendedIconifyIcon | null> = {
			icon1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 20,
			},
			icon2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
				hFlip: true,
				rotate: 1,
			},
			alias2f: {
				// icon2 + alias2f
				body: '<path d="icon2" />',
				width: 22,
				height: 24,
				vFlip: true,
				rotate: 2,
			},
			alias2a: {
				// icon2 + alias2f + alias2a
				body: '<path d="icon2" />',
				width: 20,
				height: 20,
				vFlip: true,
				rotate: 2,
			},
			alias2z: {
				// icon2 + alias2f + alias2z
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
			alias2z3: {
				// icon2 + alias2f + alias2z
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
			alias2z4: {
				// alias of alias2z3
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
			alias2z5: {
				// alias of alias2z4
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
			alias2z6: {
				// alias of alias2z5
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
			alias2z7: {
				// alias of alias2z6
				body: '<path d="icon2" />',
				width: 21,
				height: 24,
				vFlip: true,
				rotate: 1,
			},
		};

		// Do stuff
		const parsedNames = await parseIconSetAsync(
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
						parent: 'alias2z3',
					},
					alias2z5: {
						// 5 parents: alias2z4, alias2z3, alias2z, alias2f, icon2
						parent: 'alias2z4',
					},
					alias2z6: {
						// 6 parents: alias2z5, alias2z4, alias2z3, alias2z, alias2f, icon2
						parent: 'alias2z5',
					},
					alias2z7: {
						// 7 parents: alias2z6, alias2z5, alias2z4, alias2z3, alias2z, alias2f, icon2
						parent: 'alias2z6',
					},
					alias3: {
						// invalid parent
						parent: 'icon3',
					},
				},
				height: 24,
			},
			(name, data) => {
				return new Promise((fulfill) => {
					// Make sure name exists in array of pending names
					const index = names.indexOf(name);
					expect(index).not.toBe(-1);
					names = names
						.slice(0, index)
						.concat(names.slice(index + 1));

					// Check icon data
					expect(data).toEqual(expected[name]);

					fulfill(void 0);
				});
			}
		);

		// All names should have been parsed, not necessary in expected order
		expect(names).toEqual([]);
		parsedNames.sort((a, b) => a.localeCompare(b));
		expect(parsedNames).toEqual(expectedNames);
	});

	test('Bug test 1', () => {
		// Names list
		const names: string[] = ['test20', 'test21', 'BadName'];

		// Resolved data
		const expected: Record<string, ExtendedIconifyIcon | null> = {
			test20: {
				body: '<g />',
			},
			test21: {
				body: '<g />',
			},
			BadName: {
				body: '<g />',
			},
		};

		// Do stuff
		expect(
			parseIconSet(
				{
					prefix: 'api-mock-02',
					icons: {
						test20: { body: '<g />' },
						test21: { body: '<g />' },
						BadName: { body: '<g />' },
					},
				},
				(name, data) => {
					// Make sure name matches
					expect(names.length).toBeGreaterThanOrEqual(1);
					expect(name).toBe(names.shift());

					// Check icon data
					expect(data).toEqual(expected[name]);
				}
			)
		).toEqual(['test20', 'test21', 'BadName']);

		// All names should have been parsed
		expect(names).toEqual([]);
	});
});
