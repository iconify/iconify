import { setFetch, fetchJSON } from '../src/index.js';

interface FetchTestData {
	// Result on success
	result?: unknown;

	// Error on failure
	status?: number;

	// Delay before response
	delay?: number;
}

// Custom fetch data
const fetchData: Record<string, FetchTestData> = {};

// Mock fetch function
async function mockFetch(
	input: RequestInfo | URL,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	init?: RequestInit
): Promise<Response> {
	// Get data
	const url = typeof input === 'string' ? input : input.toString();
	const data = fetchData[url];

	if (!data) {
		// Not found
		return new Response(null, { status: 404 });
	}

	if (data.delay) {
		await new Promise((resolve) => setTimeout(resolve, data.delay));
	}
	if (data.status) {
		return new Response(null, { status: data.status });
	}
	return new Response(JSON.stringify(data.result), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

// Run tests
describe('Fetch data', () => {
	beforeAll(() => {
		setFetch(mockFetch);
	});

	it('Simple fetch', async () => {
		fetchData['https://example.com/simple-fetch'] = {
			result: { message: 'Success' },
		};
		const result = await fetchJSON<{ message: string }>(
			['https://example.com'],
			'/simple-fetch'
		);
		expect(result).toEqual({ message: 'Success' });
	});

	it('Failed fetch', async () => {
		fetchData['https://example.com/failed-fetch'] = {
			status: 500,
		};
		await expect(
			fetchJSON<{ message: string }>(
				['https://example.com'],
				'/failed-fetch'
			)
		).rejects.toThrow('All promises were rejected');
	});

	it('Multiple hosts, returning second result first', async () => {
		fetchData['https://sequence-test1.com/test1'] = {
			result: { message: 'Success 1' },
			delay: 1500,
		};
		fetchData['https://sequence-test2.com/test1'] = {
			result: { message: 'Success 2' },
		};

		// Get second item, should also change first index
		const result = await fetchJSON<{ message: string }>(
			['https://sequence-test1.com', 'https://sequence-test2.com'],
			'/test1'
		);
		expect(result).toEqual({ message: 'Success 2' });

		// Second host should be fetched first
		fetchData['https://sequence-test1.com/test2'] = {
			result: { message: 'Success 1.1' },
		};
		fetchData['https://sequence-test2.com/test2'] = {
			result: { message: 'Success 2.1' },
		};
		const result2 = await fetchJSON<{ message: string }>(
			['https://sequence-test1.com', 'https://sequence-test2.com'],
			'/test2'
		);
		expect(result2).toEqual({ message: 'Success 2.1' });
	});

	it('Multiple hosts, failure on first host', async () => {
		fetchData['https://api1.com/test1'] = {
			status: 500,
			delay: 2500,
		};
		fetchData['https://api2.com/test1'] = {
			result: { message: 'Success 2' },
			delay: 1000,
		};

		// Get second item, should also change first index
		const result = await fetchJSON<{ message: string }>(
			['https://api1.com', 'https://api2.com'],
			'/test1'
		);
		expect(result).toEqual({ message: 'Success 2' });
	});
});
