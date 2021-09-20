import type { RedundancyConfig } from '../src/config';
import { sendQuery } from '../src/query';

describe('Basic queries', () => {
	test('Empty query', (done) => {
		const payload = {};
		const config: RedundancyConfig = {
			resources: [],
			index: 0,
			timeout: 200,
			rotate: 100,
			random: false,
			dataAfterTimeout: false,
		};

		// Tracking
		let isSync = true;
		const startTime = Date.now();

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			() => {
				done('Query should not be called when resources list is empty');
			},
			(data, error) => {
				expect(isSync).toEqual(false);
				expect(data).toBeUndefined();
				expect(error).toBeUndefined();

				// Check status
				const status = getStatus();
				expect(status.status).toEqual('failed');
				expect(status.queriesSent).toEqual(0);
				expect(status.queriesPending).toEqual(0);

				// Should be almost instant: no items in queue
				const diff = Date.now() - startTime;
				expect(diff).toBeLessThan(50);

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

	it('Simple query', (done) => {
		const payload = {};
		const resources = ['test1'];
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
		let sentQuery = false;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(resource).toEqual(resources[0]);
				expect(queryPayload).toEqual(payload);

				// Make sure query was executed only once
				expect(sentQuery).toEqual(false);
				sentQuery = true;

				// Check status
				expect(queryItem.getQueryStatus).toEqual(getStatus);
				const status = getStatus();
				expect(status.status).toEqual('pending');
				expect(status.payload).toEqual(payload);
				expect(status.queriesSent).toEqual(1);
				expect(status.queriesPending).toEqual(1);

				// Add abort function
				queryItem.abort = (): void => {
					done('Abort should have not been called');
				};

				// Complete
				queryItem.done(result);
			},
			(data, error) => {
				// Make sure query was sent
				expect(sentQuery).toEqual(true);

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

	it('Failing query', (done) => {
		const payload = {};
		const resources = ['api1'];
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
		let sentQuery = false;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(resource).toEqual(resources[0]);
				expect(queryPayload).toEqual(payload);

				// Make sure query was executed only once
				expect(sentQuery).toEqual(false);
				sentQuery = true;

				// Add abort function
				queryItem.abort = (): void => {
					done('Abort should have not been called');
				};

				// Fail
				queryItem.done(void 0, result);
			},
			(data, error) => {
				// Make sure query was sent
				expect(sentQuery).toEqual(true);

				// Validate data
				expect(data).toBeUndefined();
				expect(error).toEqual(result);

				// Check status
				const status = getStatus();
				expect(status.status).toEqual('failed');
				expect(status.queriesSent).toEqual(1);
				expect(status.queriesPending).toEqual(0);

				// Should be almost instant
				const diff = Date.now() - startTime;
				expect(diff).toBeLessThan(40);

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

	it('Timed out query (~300ms)', (done) => {
		const payload = {};
		const resources = ['api1'];
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
		let sentQuery = false;
		let itemAborted = false;

		// Send query
		const getStatus = sendQuery(
			config,
			payload,
			(resource, queryPayload, queryItem) => {
				expect(isSync).toEqual(false);
				expect(resource).toEqual(resources[0]);
				expect(queryPayload).toEqual(payload);

				// Make sure query was executed only once
				expect(sentQuery).toEqual(false);
				sentQuery = true;

				// Add abort function
				queryItem.abort = (): void => {
					expect(itemAborted).toEqual(false);
					itemAborted = true;
				};

				// Do not do anything
			},
			(data, error) => {
				// Make sure query was sent
				expect(sentQuery).toEqual(true);

				// Validate data
				expect(data).toBeUndefined();
				expect(error).toBeUndefined();

				// Check status
				const status = getStatus();
				expect(status.status).toEqual('failed');
				expect(status.queriesSent).toEqual(1);
				expect(status.queriesPending).toEqual(0);

				// Item should have been aborted
				expect(itemAborted).toEqual(true);

				// Should have been config.rotate + config.timeout
				const diff = Date.now() - startTime;
				expect(diff).toBeGreaterThan(250);

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
});
