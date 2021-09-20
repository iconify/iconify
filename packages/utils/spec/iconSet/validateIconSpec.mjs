import { validateIconSet } from '@iconify/utils/lib/icon-set/validate';

describe('Testing validating icon', () => {
	// Add various types for testing
	const validationValues = new Map();

	beforeAll(() => {
		validationValues.set(true, {
			text: 'true',
			type: 'boolean',
		});
		validationValues.set(false, {
			text: 'false',
			type: 'boolean',
		});
		validationValues.set(
			{},
			{
				text: 'object',
				type: 'object',
			}
		);
		validationValues.set([], {
			text: 'array',
			type: 'object',
		});
		validationValues.set(24, {
			text: 'number',
			type: 'number',
		});
		validationValues.set(-2, {
			text: 'negative number',
			type: 'number',
		});
		validationValues.set(0, {
			text: 'zero',
			type: 'number',
		});
		validationValues.set('test', {
			text: 'string',
			type: 'string',
		});
		validationValues.set('', {
			text: 'empty string',
			type: 'string',
		});
	});

	// Required string
	it('body', (done) => {
		// Missing body
		try {
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						width: 16,
					},
				},
			});
			done('Expected to throw error when body is missing');
		} catch (err) {
			//
		}

		try {
			validateIconSet(
				{
					prefix: 'foo',
					icons: {
						bar: {
							width: 16,
						},
					},
				},
				{
					fix: true,
				}
			);
			done(
				'Expected to throw error when body is missing and cannot be fixed'
			);
		} catch (err) {
			//
		}

		try {
			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								width: 16,
							},
							baz: {
								body: '<g />',
							},
						},
					},
					{
						fix: true,
					}
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					baz: {
						body: '<g />',
					},
				},
			});
		} catch (err) {
			done(
				'Expected to not throw error when body is missing, but icon set can be fixed'
			);
			//
		}

		validationValues.forEach((item, value) => {
			// Validate without fixing
			try {
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: value,
						},
					},
				});

				if (item.type !== 'string') {
					done(`Expected to throw error when body is ${item.text}`);
				}
			} catch (err) {
				if (item.type === 'string') {
					done(`Expected to pass when body is ${item.text}`);
				}
			}

			// Attempt to fix (will fail because icon set is empty after failing icon is removed)
			try {
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: value,
							},
						},
					},
					{
						fix: true,
					}
				);

				if (item.type !== 'string') {
					done(`Expected to throw error when body is ${item.text}`);
				}
			} catch (err) {
				if (item.type === 'string') {
					done(`Expected to pass when body is ${item.text}`);
				}
			}

			// Attempt to fix (will not fail because another icon is valid)
			try {
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: value,
							},
							baz: {
								body: '<g />',
							},
						},
					},
					{
						fix: true,
					}
				);
			} catch (err) {
				done('Expected to pass when another icon is valid');
			}
		});

		done();
	});

	// Numbers
	['width', 'height', 'left', 'top', 'rotate'].forEach((prop) => {
		it(prop, (done) => {
			// Validate without fixing
			validationValues.forEach((item, value) => {
				try {
					validateIconSet({
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
								[prop]: value,
							},
						},
					});

					if (item.type !== 'number') {
						done(
							`Expected to throw error when ${prop} is ${item.text}`
						);
					}
				} catch (err) {
					if (item.type === 'number') {
						done(`Expected to pass when ${prop} is ${item.text}`);
					}
				}
			});

			// Fix
			validationValues.forEach((item, value) => {
				try {
					const result = validateIconSet(
						{
							prefix: 'foo',
							icons: {
								bar: {
									body: '<g />',
									[prop]: value,
								},
							},
						},
						{
							fix: true,
						}
					);

					const icon =
						item.type === 'number'
							? {
									body: '<g />',
									[prop]: value,
							  }
							: {
									// [prop] should be deleted
									body: '<g />',
							  };

					expect(result).toEqual({
						prefix: 'foo',
						icons: {
							bar: icon,
						},
					});
				} catch (err) {
					done(
						`Expected to not throw error when ${prop} is being fixed`
					);
				}
			});

			done();
		});
	});

	// Boolean
	['hFlip', 'vFlip', 'hidden'].forEach((prop) => {
		it(prop, (done) => {
			validationValues.forEach((item, value) => {
				// Validate
				try {
					validateIconSet({
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
								[prop]: value,
							},
						},
					});

					if (item.type !== 'boolean') {
						done(
							`Expected to throw error when ${prop} is ${item.text}`
						);
					}
				} catch (err) {
					if (item.type === 'boolean') {
						done(`Expected to pass when ${prop} is ${item.text}`);
					}
				}
			});

			// Fix
			validationValues.forEach((item, value) => {
				try {
					const result = validateIconSet(
						{
							prefix: 'foo',
							icons: {
								bar: {
									body: '<g />',
									[prop]: value,
								},
							},
						},
						{
							fix: true,
						}
					);

					const icon =
						item.type === 'boolean'
							? {
									body: '<g />',
									[prop]: value,
							  }
							: {
									// [prop] should be deleted
									body: '<g />',
							  };

					expect(result).toEqual({
						prefix: 'foo',
						icons: {
							bar: icon,
						},
					});
				} catch (err) {
					done(
						`Expected to not throw error when ${prop} is being fixed`
					);
				}
			});

			done();
		});
	});

	// Unexpected field
	it('foo', (done) => {
		validationValues.forEach((item, value) => {
			// Validate
			try {
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
							foo: value,
						},
					},
				});

				if (item.type === 'object') {
					done(`Expected to throw error when value is ${item.text}`);
				}
			} catch (err) {
				if (item.type !== 'object') {
					done(`Expected to pass when value is ${item.text}`);
				}
			}
		});

		// Fix
		validationValues.forEach((item, value) => {
			try {
				const result = validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
								foo: value,
							},
						},
					},
					{
						fix: true,
					}
				);

				const icon =
					item.type !== 'object'
						? {
								body: '<g />',
								foo: value,
						  }
						: {
								// should be deleted
								body: '<g />',
						  };

				expect(result).toEqual({
					prefix: 'foo',
					icons: {
						bar: icon,
					},
				});
			} catch (err) {
				done(`Expected to not throw error when value is being fixed`);
			}
		});

		done();
	});
});
