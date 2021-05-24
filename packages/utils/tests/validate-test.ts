import 'mocha';
import { expect } from 'chai';
import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validation', () => {
	it('Not object', (done) => {
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

	it('Valid set', () => {
		expect(
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			})
		).to.be.eql({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});
	});

	it('Missing stuff', (done) => {
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

	it('Characters', (done) => {
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
		).to.be.eql({
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
		).to.be.eql({
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
		).to.be.eql({
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
});
