import crossFetch from 'cross-fetch';
import { sendAPIQuery } from '@iconify/core/lib/api/query';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import { fetchAPIModule, setFetch } from '@iconify/core/lib/api/modules/fetch';
import { setAPIConfig } from '@iconify/core/lib/api/config';
import { mockAPIModule } from '@iconify/core/lib/api/modules/mock';

describe('Testing live API with fetch', () => {
	let counter = 0;
	function nextProvider() {
		return 'fetch-' + counter++;
	}

	const host = 'https://api.iconify.design';

	// Set fetch module
	beforeEach(() => {
		setFetch(crossFetch);
		setAPIModule('', fetchAPIModule);
	});

	afterAll(() => {
		setAPIModule('', mockAPIModule);
	});

	it('Missing API configuration', (done) => {
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
				done();
			}
		);
	});

	it('Custom request with provider', (done) => {
		const provider = nextProvider();
		expect(
			setAPIConfig(provider, {
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
				done();
			}
		);
	});

	it('Custom request with host', (done) => {
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
				done();
			}
		);
	});
});
