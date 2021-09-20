import type { RedundancyConfig } from '../src/config';
import type { PendingQueryItem } from '../src/query';
import { sendQuery } from '../src/query';

describe('Advanced queries with multiple resources', () => {
	it('Simple query, time out on first, success on second after third is called, ignore third (~70ms)', (done) => {
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
		let itemAborted = false;
		let secondItem: PendingQueryItem;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(queryPayload).toEqual(payload);

				// Query should be executed 3 times
				expect(sentQuery).toBeLessThan(3);
				expect(resource).toEqual(resources[sentQuery]);

				// Check status
				expect(queryItem.getQueryStatus).toEqual(getStatus);
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

						// Add abort
						queryItem.abort = (): void => {
							done(
								'Abort should have not been called for first item'
							);
						};

						// Fail in 20ms
						setTimeout(() => {
							// Status should not have changed
							const status = getStatus();
							expect(status.queriesSent).toEqual(1);
							expect(status.queriesPending).toEqual(1);

							// Fail
							queryItem.done(void 0, true);
						}, 20);
						return;

					case 2:
						// Only second query should be pending
						expect(status.queriesSent).toEqual(2);
						expect(status.queriesPending).toEqual(1);

						// Add abort
						queryItem.abort = (): void => {
							done(
								'Abort should have not been called for second item'
							);
						};

						// Save item
						secondItem = queryItem;
						return;

					case 3:
						// 2nd and 3rd queries should be pending
						expect(status.queriesSent).toEqual(3);
						expect(status.queriesPending).toEqual(2);

						// Add abort
						queryItem.abort = (): void => {
							// This item should be aborted, but only once
							expect(itemAborted).toEqual(false);
							expect(sentQuery).toEqual(3);
							itemAborted = true;
						};

						// Complete second item
						secondItem.done(result);
						return;

					default:
						done('This code should not have been reached');
				}
			},
			(data, error) => {
				// Make sure queries were sent
				expect(sentQuery).toEqual(3);

				// Third query should have been aborted
				expect(itemAborted).toEqual(true);

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

				done();
			}
		);

		// Check status
		const status = getStatus();
		expect(status.status).toEqual('pending');
		expect(status.queriesSent).toEqual(0);
		expect(status.queriesPending).toEqual(0);

		isSync = false;
	});

	it('Multiple delayed responses (~100ms)', (done) => {
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
		let itemAborted = false;
		let firstItem: PendingQueryItem;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(queryPayload).toEqual(payload);

				// Query should be executed 2 times
				expect(sentQuery).toBeLessThan(2);
				expect(resource).toEqual(resources[sentQuery]);

				// Check status
				expect(queryItem.getQueryStatus).toEqual(getStatus);
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

						// Add abort
						queryItem.abort = (): void => {
							done(
								'Abort should have not been called for first item'
							);
						};

						// Store item
						firstItem = queryItem;
						return;

					case 2:
						// Both queries should be pending
						expect(status.queriesSent).toEqual(2);
						expect(status.queriesPending).toEqual(2);

						// Add abort
						queryItem.abort = (): void => {
							expect(itemAborted).toEqual(false);
							itemAborted = true;
						};

						// Complete first item in 20ms (70ms from start), then second item
						setTimeout(() => {
							// Check status
							const status = getStatus();
							expect(status.status).toEqual('pending');
							expect(status.queriesSent).toEqual(2);
							expect(status.queriesPending).toEqual(2);

							firstItem.done(result1);

							// Complete second item in 30 ms
							setTimeout(() => {
								expect(queryItem.status).toEqual('aborted');

								// Should not change anything because query is already complete
								queryItem.done(result2);

								// Finish test
								done();
							}, 30);
						}, 20);
						return;

					default:
						done('This code should not have been reached');
				}
			},
			(data, error) => {
				// Make sure queries were sent
				expect(sentQuery).toEqual(2);

				// Second query should have been aborted
				expect(itemAborted).toEqual(true);

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

	it('Ignored response after time out (~150ms)', (done) => {
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
		let firstItem: PendingQueryItem;
		let completeCount = 0;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(queryPayload).toEqual(payload);

				// Query should be executed 2 times
				expect(sentQuery).toBeLessThan(2);
				expect(resource).toEqual(resources[sentQuery]);

				// Check status
				expect(queryItem.getQueryStatus).toEqual(getStatus);
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

						// Store item
						firstItem = queryItem;
						return;

					case 2:
						// Both queries should be pending
						expect(status.queriesSent).toEqual(2);
						expect(status.queriesPending).toEqual(2);
						return;

					default:
						done('This code should not have been reached');
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
							firstItem.done(result);

							// Complete test
							done();
						})();
						return;

					default:
						done('Callback should have been called only once');
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

	it('Response after time out (~150ms)', (done) => {
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
		let firstItem: PendingQueryItem;
		let completeCount = 0;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(queryPayload).toEqual(payload);

				// Query should be executed 2 times
				expect(sentQuery).toBeLessThan(2);
				expect(resource).toEqual(resources[sentQuery]);

				// Check status
				expect(queryItem.getQueryStatus).toEqual(getStatus);
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

						// Store item
						firstItem = queryItem;
						return;

					case 2:
						// Both queries should be pending
						expect(status.queriesSent).toEqual(2);
						expect(status.queriesPending).toEqual(2);
						return;

					default:
						done('This code should not have been reached');
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
							firstItem.done(result);
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
							done();
						})();
						return;

					default:
						done('Callback should have been called only twice');
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
