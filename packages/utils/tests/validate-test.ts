import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validation', () => {
	test('Not object', (done) => {
		try {
			validateIconSet(void 0);
			done('Expected to throw error on undefined');
		} catch (err) {
			//
		}

		try {
			validateIconSet({});
			done('Expected to throw error on empty object');
		} catch (err) {
			//
		}

		try {
			validateIconSet(null);
			done('Expected to throw error on null');
		} catch (err) {
			//
		}

		try {
			validateIconSet([]);
			done('Expected to throw error on array');
		} catch (err) {
			//
		}

		done();
	});

	test('Valid set', () => {
		expect(
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			})
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});
	});

	test('Missing stuff', (done) => {
		try {
			validateIconSet({
				prefix: 'foo',
			});
			done('Expected to throw error when icons are missing');
		} catch (err) {
			//
		}

		try {
			validateIconSet({
				prefix: 'foo',
				icons: {},
			});
			done('Expected to throw error when icons are empty');
		} catch (err) {
			//
		}

		try {
			validateIconSet([]);
			done('Expected to throw error on array');
		} catch (err) {
			//
		}

		done();
	});

	test('Characters', (done) => {
		// Correct icon set
		expect(
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				aliases: {
					baz: {
						parent: 'bar',
						hFlip: true,
					},
				},
				chars: {
					e00: 'bar',
					e01: 'baz',
				},
			})
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
			aliases: {
				baz: {
					parent: 'bar',
					hFlip: true,
				},
			},
			chars: {
				e00: 'bar',
				e01: 'baz',
			},
		});

		// Missing icon
		try {
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				chars: {
					e01: 'baz',
				},
			});
			done(
				'Expected to throw error when character points to missing icon'
			);
		} catch (err) {
			//
		}

		expect(
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					chars: {
						e01: 'baz',
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

		// Bad character
		try {
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				chars: {
					test: 'bar',
				},
			});
			done('Expected to throw error when character is invalid');
		} catch (err) {
			//
		}

		expect(
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					chars: {
						// Valid character
						'e000-f123': 'bar',
						// Multiple invalid characters
						'test': 'bar',
						'E0': 'bar',
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
			chars: {
				'e000-f123': 'bar',
			},
		});

		done();
	});

	test('Invalid default values', (done) => {
		try {
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						icon1: {
							body: '<path d="icon1" />',
						},
					},
					height: 24,
					// Object
					rotate: {
						foo: 1,
					},
				},
				{ fix: true }
			);
			done('Expected to throw error for bad default properties');
		} catch (err) {
			//
		}

		try {
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						icon1: {
							body: '<path d="icon1" />',
						},
					},
					height: 24,
					// Object
					hFlip: null,
				},
				{ fix: true }
			);
			done('Expected to throw error for bad default properties');
		} catch (err) {
			//
		}

		try {
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						icon1: {
							body: '<path d="icon1" />',
						},
					},
					height: 24,
					// String
					width: '32',
				},
				{ fix: true }
			);
			done('Expected to throw error for bad default properties');
		} catch (err) {
			//
		}

		done();
	});
});
