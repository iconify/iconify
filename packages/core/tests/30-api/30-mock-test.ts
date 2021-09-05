/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import { setAPIConfig } from '../../lib/api/config';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons } from '../../lib/api/icons';
import type { IconifyMockAPIDelayDoneCallback } from '../../lib/api/modules/mock';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { getStorage, iconExists } from '../../lib/storage/storage';

describe('Testing mock API module', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return 'api-mock-' + (prefixCounter < 10 ? '0' : '') + prefixCounter;
	}

	// Set API module for provider
	const provider = nextPrefix();
	setAPIConfig(provider, {
		resources: ['https://api1.local'],
	});
	setAPIModule(provider, mockAPIModule);

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
				expect(isSync).to.be.equal(false);
				expect(loaded).to.be.eql([]);
				expect(pending).to.be.eql([]);
				expect(missing).to.be.eql([
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
				expect(isSync).to.be.equal(false);
				// All icons should have been loaded because API waits one tick before sending response, during which both queries are processed
				expect(loaded).to.be.eql([
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
				expect(pending).to.be.eql([]);
				expect(missing).to.be.eql([]);
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
						expect(loaded).to.be.eql([
							{
								provider,
								prefix,
								name: 'test10',
							},
						]);
						expect(pending).to.be.eql([
							{
								provider,
								prefix,
								name: 'test20',
							},
						]);

						// Send second response
						expect(typeof next).to.be.equal('function');
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						next!();
						break;

					case 2:
						// All icons should have been loaded
						expect(loaded).to.be.eql([
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
						expect(missing).to.be.eql([]);
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
				expect(iconExists(storage, name)).to.be.equal(false);

				// Set data
				next();

				// Icon should be loaded now
				expect(iconExists(storage, name)).to.be.equal(true);

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
});
