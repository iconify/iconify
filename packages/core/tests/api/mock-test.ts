import { addAPIProvider } from '../../lib/api/config';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons } from '../../lib/api/icons';
import type { IconifyMockAPIDelayDoneCallback } from '../../lib/api/modules/mock';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { getStorage, iconExists } from '../../lib/storage/storage';
import { sendAPIQuery } from '../../lib/api/query';

describe('Testing mock API module', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mock-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
		);
	}

	// Set API module for provider
	const provider = nextPrefix();

	beforeEach(() => {
		addAPIProvider(provider, {
			resources: ['https://api1.local'],
		});
		setAPIModule(provider, mockAPIModule);
	});

	// Tests
	it('404 response', (done) => {
		const prefix = nextPrefix();

		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			icons: ['test1', 'test2'],
			response: 404,
		});

		let isSync = true;

		loadIcons(
			[
				{
					provider,
					prefix,
					name: 'test1',
				},
			],
			(loaded, missing, pending) => {
				expect(isSync).toBe(false);
				expect(loaded).toEqual([]);
				expect(pending).toEqual([]);
				expect(missing).toEqual([
					{
						provider,
						prefix,
						name: 'test1',
					},
				]);
				done();
			}
		);

		isSync = false;
	});

	it('Load few icons', (done) => {
		const prefix = nextPrefix();

		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					test10: {
						body: '<g />',
					},
					test11: {
						body: '<g />',
					},
				},
			},
		});
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					test20: {
						body: '<g />',
					},
					test21: {
						body: '<g />',
					},
				},
			},
		});

		let isSync = true;

		loadIcons(
			[
				{
					provider,
					prefix,
					name: 'test10',
				},
				{
					provider,
					prefix,
					name: 'test20',
				},
			],
			(loaded, missing, pending) => {
				expect(isSync).toBe(false);
				// All icons should have been loaded because API waits one tick before sending response, during which both queries are processed
				expect(loaded).toEqual([
					{
						provider,
						prefix,
						name: 'test10',
					},
					{
						provider,
						prefix,
						name: 'test20',
					},
				]);
				expect(pending).toEqual([]);
				expect(missing).toEqual([]);
				done();
			}
		);

		isSync = false;
	});

	it('Load in batches and testing delay', (done) => {
		const prefix = nextPrefix();
		let next: IconifyMockAPIDelayDoneCallback | undefined;

		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					test10: {
						body: '<g />',
					},
					test11: {
						body: '<g />',
					},
				},
			},
		});
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					test20: {
						body: '<g />',
					},
					test21: {
						body: '<g />',
					},
				},
			},
			delay: (callback) => {
				next = callback;
			},
		});

		let callbackCounter = 0;

		loadIcons(
			[
				{
					provider,
					prefix,
					name: 'test10',
				},
				{
					provider,
					prefix,
					name: 'test20',
				},
			],
			(loaded, missing, pending) => {
				callbackCounter++;
				switch (callbackCounter) {
					case 1:
						// First load: only 'test10'
						expect(loaded).toEqual([
							{
								provider,
								prefix,
								name: 'test10',
							},
						]);
						expect(pending).toEqual([
							{
								provider,
								prefix,
								name: 'test20',
							},
						]);

						// Send second response
						expect(typeof next).toBe('function');
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						next!();
						break;

					case 2:
						// All icons should have been loaded
						expect(loaded).toEqual([
							{
								provider,
								prefix,
								name: 'test10',
							},
							{
								provider,
								prefix,
								name: 'test20',
							},
						]);
						expect(missing).toEqual([]);
						done();
						break;

					default:
						done('Callback was called more times than expected');
				}
			}
		);
	});

	// This is useful for testing component where loadIcons() cannot be accessed
	it('Using timer in callback for second test', (done) => {
		const prefix = nextPrefix();
		const name = 'test1';

		// Mock data
		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					[name]: {
						body: '<g />',
					},
				},
			},
			delay: (next) => {
				// Icon should not be loaded yet
				const storage = getStorage(provider, prefix);
				expect(iconExists(storage, name)).toBe(false);

				// Set data
				next();

				// Icon should be loaded now
				expect(iconExists(storage, name)).toBe(true);

				done();
			},
		});

		// Load icons
		loadIcons([
			{
				provider,
				prefix,
				name,
			},
		]);
	});

	it('Custom query', (done) => {
		mockAPIData({
			type: 'custom',
			provider,
			uri: '/test',
			response: {
				foo: true,
			},
		});

		let isSync = true;

		sendAPIQuery(
			provider,
			{
				type: 'custom',
				provider,
				uri: '/test',
			},
			(data, error) => {
				expect(error).toBeUndefined();
				expect(data).toEqual({
					foo: true,
				});
				expect(isSync).toBe(false);
				done();
			}
		);

		isSync = false;
	});

	it('Custom query with host', (done) => {
		const host = 'http://' + nextPrefix();
		setAPIModule(host, mockAPIModule);
		mockAPIData({
			type: 'host',
			host,
			uri: '/test',
			response: {
				foo: 2,
			},
		});

		let isSync = true;

		sendAPIQuery(
			{
				resources: [host],
			},
			{
				type: 'custom',
				uri: '/test',
			},
			(data, error) => {
				expect(error).toBeUndefined();
				expect(data).toEqual({
					foo: 2,
				});
				expect(isSync).toBe(false);
				done();
			}
		);

		isSync = false;
	});

	it('not_found response', (done) => {
		const prefix = nextPrefix();

		mockAPIData({
			type: 'icons',
			provider,
			prefix,
			icons: ['test1', 'test2'],
			response: {
				prefix,
				icons: {},
				not_found: ['test1', 'test2'],
			},
		});

		let isSync = true;

		loadIcons(
			[
				{
					provider,
					prefix,
					name: 'test1',
				},
			],
			(loaded, missing, pending) => {
				expect(isSync).toBe(false);
				expect(loaded).toEqual([]);
				expect(pending).toEqual([]);
				expect(missing).toEqual([
					{
						provider,
						prefix,
						name: 'test1',
					},
				]);
				done();
			}
		);

		isSync = false;
	});
});
