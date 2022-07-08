import type { RedundancyConfig } from '../src/config';
import type { QueryModuleResponse } from '../src/query';
import { sendQuery } from '../src/query';

describe('Advanced queries with multiple resources', () => {
	it('Simple query, time out on first, success on second after third is called, ignore third (~70ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2', 'api3'];
			const result = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 200,
				rotate: 50,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;
			let secondCallback: QueryModuleResponse;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed 3 times
					expect(sentQuery).toBeLessThan(3);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// Tests specific to each query
					switch (sentQuery) {
						case 1:
							// First query
							expect(status.queriesSent).toEqual(1);
							expect(status.queriesPending).toEqual(1);

							// Fail in 20ms
							setTimeout(() => {
								// Status should not have changed
								const status = getStatus();
								expect(status.queriesSent).toEqual(1);
								expect(status.queriesPending).toEqual(1);

								// Fail
								callback('next', true);
							}, 20);
							return;

						case 2:
							// Only second query should be pending
							expect(status.queriesSent).toEqual(2);
							expect(status.queriesPending).toEqual(1);

							// Save item
							secondCallback = callback;
							return;

						case 3:
							// 2nd and 3rd queries should be pending
							expect(status.queriesSent).toEqual(3);
							expect(status.queriesPending).toEqual(2);

							// Complete second item
							secondCallback('success', result);
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(3);

					// Validate data
					expect(data).toEqual(result);
					expect(error).toBeUndefined();

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('completed');
					expect(status.queriesSent).toEqual(3);
					expect(status.queriesPending).toEqual(0);

					// 20ms from first query failing, 50ms from delay between second and third
					const diff = Date.now() - startTime;
					expect(diff > 50 && diff < 90).toEqual(true);

					fulfill(true);
				}
			);

			// Check status
			const status = getStatus();
			expect(status.status).toEqual('pending');
			expect(status.queriesSent).toEqual(0);
			expect(status.queriesPending).toEqual(0);

			isSync = false;
		});
	});

	it('Multiple delayed responses (~100ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const result1 = {};
			const result2 = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 200,
				rotate: 50,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;
			let firstCallback: QueryModuleResponse;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed 2 times
					expect(sentQuery).toBeLessThan(2);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// Tests specific to each query
					switch (sentQuery) {
						case 1:
							// First query
							expect(status.queriesSent).toEqual(1);
							expect(status.queriesPending).toEqual(1);

							// Store callback
							firstCallback = callback;
							return;

						case 2:
							// Both queries should be pending
							expect(status.queriesSent).toEqual(2);
							expect(status.queriesPending).toEqual(2);

							// Complete first item in 20ms (70ms from start), then second item
							setTimeout(() => {
								// Check status
								const status = getStatus();
								expect(status.status).toEqual('pending');
								expect(status.queriesSent).toEqual(2);
								expect(status.queriesPending).toEqual(2);

								firstCallback('success', result1);

								// Complete second item in 30 ms
								setTimeout(() => {
									// Should not change anything because query is already complete
									callback('success', result2);

									// Finish test
									fulfill(true);
								}, 30);
							}, 20);
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Validate data
					expect(data).toEqual(result1);
					expect(error).toBeUndefined();

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('completed');
					expect(status.queriesSent).toEqual(2);
					expect(status.queriesPending).toEqual(0);

					// 50ms delay between queries, 20ms delay by test timer
					const diff = Date.now() - startTime;
					expect(diff > 50 && diff < 90).toEqual(true);

					// Do not finish: second item is still pending
				}
			);

			// Check status
			const status = getStatus();
			expect(status.status).toEqual('pending');
			expect(status.queriesSent).toEqual(0);
			expect(status.queriesPending).toEqual(0);

			isSync = false;
		});
	});

	it('Ignored response after time out (~150ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const result = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 100,
				rotate: 25,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;
			let firstCallback: QueryModuleResponse;
			let completeCount = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed 2 times
					expect(sentQuery).toBeLessThan(2);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// Tests specific to each query
					switch (sentQuery) {
						case 1:
							// First query
							expect(status.queriesSent).toEqual(1);
							expect(status.queriesPending).toEqual(1);

							// Store callback
							firstCallback = callback;
							return;

						case 2:
							// Both queries should be pending
							expect(status.queriesSent).toEqual(2);
							expect(status.queriesPending).toEqual(2);
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Bump couneter
					completeCount++;
					switch (completeCount) {
						case 1:
							// First call: time out
							((): void => {
								// Validate data
								expect(data).toBeUndefined();
								expect(error).toBeUndefined();

								// Check status
								const status = getStatus();
								expect(status.status).toEqual('failed');
								expect(status.queriesSent).toEqual(2);
								expect(status.queriesPending).toEqual(0);

								// 25ms delay between queries * 2 + 100ms timeout
								const diff = Date.now() - startTime;
								expect(diff > 130 && diff < 170).toEqual(true);

								// Send data from first query, which should be ignored because dataAfterTimeout is false
								firstCallback('success', result);

								// Complete test
								fulfill(true);
							})();
							return;

						default:
							reject(
								'Callback should have been called only once'
							);
					}
				}
			);

			// Check status
			const status = getStatus();
			expect(status.status).toEqual('pending');
			expect(status.queriesSent).toEqual(0);
			expect(status.queriesPending).toEqual(0);

			isSync = false;
		});
	});

	it('Response after time out (~150ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const result = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 100,
				rotate: 25,
				random: false,
				dataAfterTimeout: true,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;
			let firstCallback: QueryModuleResponse;
			let completeCount = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed 2 times
					expect(sentQuery).toBeLessThan(2);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// Tests specific to each query
					switch (sentQuery) {
						case 1:
							// First query
							expect(status.queriesSent).toEqual(1);
							expect(status.queriesPending).toEqual(1);

							// Store callback
							firstCallback = callback;
							return;

						case 2:
							// Both queries should be pending
							expect(status.queriesSent).toEqual(2);
							expect(status.queriesPending).toEqual(2);
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Bump couneter
					completeCount++;
					switch (completeCount) {
						case 1:
							// First call: time out
							((): void => {
								// Validate data
								expect(data).toBeUndefined();
								expect(error).toBeUndefined();

								// Check status
								const status = getStatus();
								expect(status.status).toEqual('failed');
								expect(status.queriesSent).toEqual(2);
								expect(status.queriesPending).toEqual(0);

								// 25ms delay between queries * 2 + 100ms timeout
								const diff = Date.now() - startTime;
								expect(diff > 130 && diff < 170).toEqual(true);

								// Send data from first query
								firstCallback('success', result);
							})();
							return;

						case 2:
							// Second call: data
							((): void => {
								// Validate data
								expect(data).toEqual(result);
								expect(error).toBeUndefined();

								// Check status
								const status = getStatus();
								expect(status.status).toEqual('completed');
								expect(status.queriesSent).toEqual(2);
								expect(status.queriesPending).toEqual(0);

								// Same as few lines above
								const diff = Date.now() - startTime;
								expect(diff > 130 && diff < 170).toEqual(true);

								// Done
								fulfill(true);
							})();
							return;

						default:
							reject(
								'Callback should have been called only twice'
							);
					}
				}
			);

			// Check status
			const status = getStatus();
			expect(status.status).toEqual('pending');
			expect(status.queriesSent).toEqual(0);
			expect(status.queriesPending).toEqual(0);

			isSync = false;
		});
	});
});
