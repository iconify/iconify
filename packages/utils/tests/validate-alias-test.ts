import 'mocha';
import { expect } from 'chai';
import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validating alias', () => {
	it('Empty', () => {
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
		).to.be.eql({
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
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});
	});

	it('Null', (done) => {
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
			done('Expected to throw error when aliases is null');
		} catch (err) {
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
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});

		done();
	});

	it('Invalid parent', (done) => {
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
			done(
				'Expected to throw error when alias has missing parent, got ' +
					JSON.stringify(result)
			);
		} catch (err) {
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
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});

		done();
	});

	it('Invalid parent, 2 levels', (done) => {
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
			done(
				'Expected to throw error when alias has missing parent, got ' +
					JSON.stringify(result)
			);
		} catch (err) {
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
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});

		done();
	});

	it('Invalid parent, 2 levels, reverse order', (done) => {
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
			done(
				'Expected to throw error when alias has missing parent, got ' +
					JSON.stringify(result)
			);
		} catch (err) {
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
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});

		done();
	});

	it('Parent loop', (done) => {
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
			done(
				'Expected to throw error when alias has missing parent, got ' +
					JSON.stringify(result)
			);
		} catch (err) {
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
		).to.be.eql({
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

		done();
	});
});
