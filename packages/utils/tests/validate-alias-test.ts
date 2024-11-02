import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validating alias', () => {
	test('Empty', () => {
		expect(
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				aliases: {},
			})
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			aliases: {},
		});

		// Fix it
		expect(
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {},
				},
				{ fix: true }
			)
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});
	});

	test('Null', () => {
		return new Promise((fulfill, reject) => {
			try {
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: null,
				});
				reject(
					new Error('Expected to throw error when aliases is null')
				);
				return;
			} catch {
				//
			}

			// Fix it
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						aliases: null,
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			});

			fulfill(true);
		});
	});

	test('Invalid parent', () => {
		return new Promise((fulfill, reject) => {
			try {
				const result = validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {
						baz: {
							parent: 'missing',
						},
					},
				});
				reject(
					new Error(
						'Expected to throw error when alias has missing parent, got ' +
							JSON.stringify(result)
					)
				);
				return;
			} catch {
				//
			}

			// Fix it
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						aliases: {
							baz: {
								parent: 'missing',
							},
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			});

			fulfill(true);
		});
	});

	test('Invalid parent, 2 levels', () => {
		return new Promise((fulfill, reject) => {
			try {
				const result = validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {
						baz: {
							parent: 'missing',
						},
						baz2: {
							parent: 'baz',
						},
					},
				});
				reject(
					new Error(
						'Expected to throw error when alias has missing parent, got ' +
							JSON.stringify(result)
					)
				);
				return;
			} catch {
				//
			}

			// Fix it
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						aliases: {
							baz: {
								parent: 'missing',
							},
							baz2: {
								parent: 'baz',
							},
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			});

			fulfill(true);
		});
	});

	test('Invalid parent, 2 levels, reverse order', () => {
		return new Promise((fulfill, reject) => {
			try {
				const result = validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {
						baz: {
							parent: 'baz2',
						},
						baz2: {
							parent: 'missing',
						},
					},
				});
				reject(
					new Error(
						'Expected to throw error when alias has missing parent, got ' +
							JSON.stringify(result)
					)
				);
				return;
			} catch {
				//
			}

			// Fix it
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						aliases: {
							baz: {
								parent: 'baz2',
							},
							baz2: {
								parent: 'missing',
							},
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			});

			fulfill(true);
		});
	});

	test('Parent loop', () => {
		return new Promise((fulfill, reject) => {
			try {
				const result = validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {
						baz: {
							parent: 'baz2',
						},
						baz2: {
							parent: 'baz',
						},
						baz3: {
							parent: 'bar',
						},
					},
				});
				reject(
					new Error(
						'Expected to throw error when alias has missing parent, got ' +
							JSON.stringify(result)
					)
				);
				return;
			} catch {
				//
			}

			// Fix it
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						aliases: {
							baz: {
								parent: 'baz2',
							},
							baz2: {
								parent: 'baz',
							},
							baz3: {
								parent: 'bar',
							},
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				aliases: {
					baz3: {
						parent: 'bar',
					},
				},
			});

			fulfill(true);
		});
	});
});
