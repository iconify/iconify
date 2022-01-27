import { initRedundancy } from '@iconify/api-redundancy';

describe('Redundancy class', () => {
	it('Simple query', (done) => {
		const redundancy = initRedundancy({
			resources: [
				'https://api.local', // Will fail
				'https://api-backup1.local', // Success
				'https://api-backup2.local',
			],
			rotate: 20,
			timeout: 100,
		});

		// Premade responses
		const responses = {
			'https://api-backup1.local/foo': 'foo',
		};
		let counter = 0;
		let doneCallbackCalled = false;

		const query = redundancy.query(
			'/foo',
			(resource, payload, callback) => {
				counter++;
				expect(counter).toBeLessThan(3); // No more than 2 queries should be executed

				// Make URI from resource + payload
				const uri = resource + payload;

				// Get fake data if it exists
				if (responses[uri] === void 0) {
					return;
				}

				// Do something with "data", simulate instant callback
				callback('success', responses[uri]);

				// Complete test
				setTimeout(() => {
					expect(counter).toEqual(2);
					expect(doneCallbackCalled).toEqual(true);
					expect(query().status).toEqual('completed');
					expect(redundancy.getIndex()).toEqual(1); // Should have changed to 1 after query
					done();
				});
			},
			(data) => {
				expect(data).toEqual('foo');
				doneCallbackCalled = true;
			}
		);

		// Test find()
		expect(redundancy.find((item) => item().payload === '/foo')).toEqual(
			query
		);
		expect(redundancy.find((item) => item().status === 'pending')).toEqual(
			query
		);
	});

	it('Different start index', (done) => {
		const redundancy = initRedundancy({
			resources: [
				'https://api.local',
				'https://api-backup1.local',
				'https://api-backup2.local',
			],
			rotate: 20,
			timeout: 3000,
			index: 1,
		});

		// Premade responses
		const responses = {
			'https://api-backup1.local/foo': 'foo',
		};
		let counter = 0;

		const query = redundancy.query(
			'/foo',
			(resource, payload, callback) => {
				counter++;
				expect(counter).toBeLessThan(2); // Should be success on first call because start index = 1

				// Make URI from resource + payload
				const uri = resource + payload;

				// Get fake data if it exists
				if (responses[uri] === void 0) {
					return;
				}

				// Do something with "data", simulate instant callback
				callback('success', responses[uri]);

				// Complete test
				setTimeout(() => {
					expect(counter).toEqual(1);
					expect(query().status).toEqual('completed');
					expect(redundancy.getIndex()).toEqual(1);
					done();
				});
			}
		);

		// Test find()
		expect(redundancy.find((item) => item().payload === '/foo')).toEqual(
			query
		);
		expect(redundancy.find((item) => item().status === 'pending')).toEqual(
			query
		);
	});
});
