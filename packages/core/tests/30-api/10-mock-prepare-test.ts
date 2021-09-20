/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import type { IconifyMockAPI } from '../../lib/api/modules/mock';
import {
	mockAPIModule,
	mockAPIData,
	storage,
} from '../../lib/api/modules/mock';

describe('Testing mock API module prepare function', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mock-prepare-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter
		);
	}

	const prepare = mockAPIModule.prepare;

	it('Setting data for all icons', () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		const item: IconifyMockAPI = {
			provider,
			prefix,
			response: 404,
		};
		mockAPIData(item);

		// Make sure item is stored correctly
		expect(typeof storage[provider]).to.be.equal('object');
		expect(storage[provider][prefix]).to.be.eql([item]);

		// Find item for icons
		const result = prepare(provider, prefix, ['foo', 'bar', 'baz']);
		expect(result).to.be.eql([
			{
				provider,
				prefix,
				icons: ['foo', 'bar', 'baz'],
				index: 0,
			},
		]);
	});

	it('Setting multiple entries', () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		const item1: IconifyMockAPI = {
			provider,
			prefix,
			response: 404,
			icons: ['foo', 'bar'],
		};
		const item2: IconifyMockAPI = {
			provider,
			prefix,
			response: 404,
			icons: 'baz',
		};
		const item3: IconifyMockAPI = {
			provider,
			prefix,
			response: {
				prefix,
				icons: {
					test10: {
						body: '<g />',
					},
				},
			},
		};
		mockAPIData(item1);
		mockAPIData(item2);
		mockAPIData(item3);

		// Make sure item is stored correctly
		expect(typeof storage[provider]).to.be.equal('object');
		expect(storage[provider][prefix]).to.be.eql([item1, item2, item3]);

		// Find items for icons
		const result = prepare(provider, prefix, [
			'foo',
			'baz',
			'bar',
			'test1',
			'test10',
			'test2',
		]);
		expect(result).to.be.eql([
			// Unknown icons first
			{
				provider,
				prefix,
				icons: ['test1', 'test2'],
			},
			{
				provider,
				prefix,
				icons: ['foo', 'bar'],
				index: 0,
			},
			{
				provider,
				prefix,
				icons: ['baz'],
				index: 1,
			},
			{
				provider,
				prefix,
				icons: ['test10'],
				index: 2,
			},
		]);
	});

	it('Without catch-all query', () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		const item: IconifyMockAPI = {
			provider,
			prefix,
			response: 404,
			icons: ['foo'],
		};
		mockAPIData(item);

		// Make sure item is stored correctly
		expect(typeof storage[provider]).to.be.equal('object');
		expect(storage[provider][prefix]).to.be.eql([item]);

		// Find item for icons
		const result = prepare(provider, prefix, ['foo', 'bar', 'baz']);
		expect(result).to.be.eql([
			// Missing icons first
			{
				provider,
				prefix,
				icons: ['bar', 'baz'],
			},
			{
				provider,
				prefix,
				icons: ['foo'],
				index: 0,
			},
		]);
	});
});
