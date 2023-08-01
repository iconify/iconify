import { sendAPIQuery } from '../../lib/api/query';
import { setAPIModule } from '../../lib/api/modules';
import { fetchAPIModule, setFetch } from '../../lib/api/modules/fetch';
import { addAPIProvider } from '../../lib/api/config';
import { mockAPIModule } from '../../lib/api/modules/mock';

describe('Testing live API with fetch', () => {
	let counter = 0;
	function nextProvider(): string {
		return 'fetch-' + (counter++).toString();
	}

	const host = 'https://api.iconify.design';

	// Set fetch module
	beforeEach(() => {
		setFetch(fetch);
		setAPIModule('', fetchAPIModule);
	});

	afterAll(() => {
		setAPIModule('', mockAPIModule);
	});

	it('Missing API configuration', () => {
		return new Promise((fulfill) => {
			const provider = nextProvider();
			sendAPIQuery(
				provider,
				{
					type: 'custom',
					provider,
					uri: '/collections',
				},
				(data, error) => {
					expect(error).toBe(424);
					expect(data).toBeUndefined();
					fulfill(true);
				}
			);
		});
	});

	it('Custom request with provider', () => {
		return new Promise((fulfill) => {
			const provider = nextProvider();
			expect(
				addAPIProvider(provider, {
					resources: [host],
				})
			).toBe(true);

			sendAPIQuery(
				provider,
				{
					type: 'custom',
					provider,
					uri: '/collections',
				},
				(data, error) => {
					expect(error).toBeUndefined();
					expect(typeof data).toBe('object');
					fulfill(true);
				}
			);
		});
	});

	it('Custom request with host', () => {
		return new Promise((fulfill) => {
			sendAPIQuery(
				{
					resources: [host],
				},
				{
					type: 'custom',
					uri: '/collections',
				},
				(data, error) => {
					expect(error).toBeUndefined();
					expect(typeof data).toBe('object');
					fulfill(true);
				}
			);
		});
	});
});
