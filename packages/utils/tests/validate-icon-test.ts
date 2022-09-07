import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validating icon', () => {
	// Add various types for testing
	const validationValues = new Map<
		| boolean
		| Record<string | number | symbol, never>
		| []
		| number
		| string,
		{ text: string; type: string }
	>();

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
	test('body', () => {
		return new Promise((fulfill, reject) => {
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
				reject('Expected to throw error when body is missing');
				return;
			} catch {
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
				reject(
					'Expected to throw error when body is missing and cannot be fixed'
				);
				return;
			} catch {
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
			} catch {
				reject(
					'Expected to not throw error when body is missing, but icon set can be fixed'
				);
				return;
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
						reject(
							`Expected to throw error when body is ${item.text}`
						);
						return;
					}
				} catch {
					if (item.type === 'string') {
						reject(`Expected to pass when body is ${item.text}`);
						return;
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
						reject(
							`Expected to throw error when body is ${item.text}`
						);
						return;
					}
				} catch {
					if (item.type === 'string') {
						reject(`Expected to pass when body is ${item.text}`);
						return;
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
				} catch {
					reject('Expected to pass when another icon is valid');
					return;
				}
			});

			fulfill(true);
		});
	});

	// Numbers
	['width', 'height', 'left', 'top', 'rotate'].forEach((prop) => {
		test(prop, () => {
			return new Promise((fulfill, reject) => {
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
							reject(
								`Expected to throw error when ${prop} is ${item.text}`
							);
							return;
						}
					} catch {
						if (item.type === 'number') {
							reject(
								`Expected to pass when ${prop} is ${item.text}`
							);
							return;
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
					} catch {
						reject(
							`Expected to not throw error when ${prop} is being fixed`
						);
						return;
					}
				});

				fulfill(true);
			});
		});
	});

	// Boolean
	['hFlip', 'vFlip', 'hidden'].forEach((prop) => {
		test(prop, () => {
			return new Promise((fulfill, reject) => {
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
							reject(
								`Expected to throw error when ${prop} is ${item.text}`
							);
							return;
						}
					} catch {
						if (item.type === 'boolean') {
							reject(
								`Expected to pass when ${prop} is ${item.text}`
							);
							return;
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
					} catch {
						reject(
							`Expected to not throw error when ${prop} is being fixed`
						);
						return;
					}
				});

				fulfill(true);
			});
		});
	});

	// Unexpected field
	test('foo', () => {
		return new Promise((fulfill, reject) => {
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
						reject(
							`Expected to throw error when value is ${item.text}`
						);
						return;
					}
				} catch {
					if (item.type !== 'object') {
						reject(`Expected to pass when value is ${item.text}`);
						return;
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
				} catch {
					reject(
						`Expected to not throw error when value is being fixed`
					);
					return;
				}
			});

			fulfill(true);
		});
	});
});
