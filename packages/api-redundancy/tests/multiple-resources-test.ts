import type { RedundancyConfig } from '../src/config';
import { sendQuery } from '../src/query';

describe('Multiple resources', () => {
	it('Simple query, success on first attempt', () => {
		return new Promise((fulfill) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const result = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 200,
				rotate: 100,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(resource).toEqual('api1');
					expect(queryPayload).toEqual(payload);

					// Query should be executed only once because it should finish before second attempt
					expect(sentQuery).toEqual(0);
					sentQuery++;

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);
					expect(status.queriesSent).toEqual(1);
					expect(status.queriesPending).toEqual(1);

					// Complete
					callback('success', result);
				},
				(data, error) => {
					// Make sure query was sent
					expect(sentQuery).toEqual(1);

					// Validate data
					expect(data).toEqual(result);
					expect(error).toBeUndefined();

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('completed');
					expect(status.queriesSent).toEqual(1);
					expect(status.queriesPending).toEqual(0);

					// Should be almost instant
					const diff = Date.now() - startTime;
					expect(diff).toBeLessThan(50);

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

	it('Simple query, time out on first, success on second (~100ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const result = {};
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 200,
				rotate: 100,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload, callback) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed twice
					expect(sentQuery).toBeLessThan(2);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// All queries should be pending
					expect(status.queriesSent).toEqual(sentQuery);
					expect(status.queriesPending).toEqual(sentQuery);

					// Time out first, complete second
					switch (sentQuery) {
						case 1:
							// Do nothing, let it time out
							return;

						case 2:
							// Send result
							callback('success', result);
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Validate data
					expect(data).toEqual(result);
					expect(error).toBeUndefined();

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('completed');
					expect(status.queriesSent).toEqual(2);
					expect(status.queriesPending).toEqual(0);

					// Delay between first and second queries
					const diff = Date.now() - startTime;
					expect(diff).toBeGreaterThan(50);
					expect(diff).toBeLessThan(150);

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

	it('Time out all queries (~100ms)', () => {
		return new Promise((fulfill, reject) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const config: RedundancyConfig = {
				resources,
				index: 0,
				timeout: 50,
				rotate: 25,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Query should be executed twice
					expect(sentQuery).toBeLessThan(2);
					expect(resource).toEqual(resources[sentQuery]);

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('pending');
					expect(status.payload).toEqual(payload);

					// Bump counter
					sentQuery++;

					// All queries should be pending
					expect(status.queriesSent).toEqual(sentQuery);
					expect(status.queriesPending).toEqual(sentQuery);

					// Add abort functions
					switch (sentQuery) {
						case 1:
						case 2:
							// Do not send anything
							return;

						default:
							reject('This code should not have been reached');
					}
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Validate data
					expect(data).toBeUndefined();
					expect(error).toBeUndefined();

					// Check status
					const status = getStatus();
					expect(status.status).toEqual('failed');
					expect(status.queriesSent).toEqual(2);
					expect(status.queriesPending).toEqual(0);

					// rotate * 2 + timeout
					const diff = Date.now() - startTime;
					expect(diff).toBeGreaterThan(90);
					expect(diff).toBeLessThan(120);

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

	it('Start with second resource (~100ms)', () => {
		return new Promise((fulfill) => {
			const payload = {};
			const resources = ['api1', 'api2'];
			const config: RedundancyConfig = {
				resources,
				index: 1,
				timeout: 50,
				rotate: 25,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			const startTime = Date.now();
			let sentQuery = 0;

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Resource order should be: 1, 0
					expect(resource).not.toEqual(resources[sentQuery]);
					expect(resource).toEqual(resources[1 - sentQuery]);

					// Bump counter
					sentQuery++;
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(2);

					// Validate data
					expect(data).toBeUndefined();
					expect(error).toBeUndefined();

					// rotate * 2 + timeout
					const diff = Date.now() - startTime;
					expect(diff).toBeGreaterThan(90);
					expect(diff).toBeLessThan(120);

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

	it('Start with last resource (~150ms)', () => {
		return new Promise((fulfill) => {
			const payload = {};
			const resources = ['api1', 'api2', 'api3', 'api4'];
			const config: RedundancyConfig = {
				resources,
				index: 3,
				timeout: 50,
				rotate: 25,
				random: false,
				dataAfterTimeout: false,
			};

			// Tracking
			let isSync = true;
			let sentQuery = 0;
			const startTime = Date.now();

			// Send query
			const getStatus = sendQuery(
				config,
				payload,
				(resource, queryPayload) => {
					expect(isSync).toEqual(false);
					expect(queryPayload).toEqual(payload);

					// Resource order should be: 3, 0, 1, 2
					expect(resource).not.toEqual(resources[sentQuery]);

					const expectedIndex = sentQuery === 0 ? 3 : sentQuery - 1;
					expect(resource).toEqual(resources[expectedIndex]);

					// Bump counter
					sentQuery++;
				},
				(data, error) => {
					// Make sure queries were sent
					expect(sentQuery).toEqual(4);

					// Validate data
					expect(data).toBeUndefined();
					expect(error).toBeUndefined();

					// rotate * 4 + timeout
					const diff = Date.now() - startTime;
					expect(diff).toBeGreaterThan(140);
					expect(diff).toBeLessThan(170);

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
});
