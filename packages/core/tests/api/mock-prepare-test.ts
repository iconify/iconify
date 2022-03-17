import type { IconifyMockAPI } from '../../lib/api/modules/mock';
import {
	mockAPIModule,
	mockAPIData,
	iconsStorage,
} from '../../lib/api/modules/mock';

describe('Testing mock API module prepare function', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mock-prepare-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
		);
	}

	const prepare = mockAPIModule.prepare;

	it('Setting data for all icons', () => {
		const provider = nextPrefix();
		const prefix = nextPrefix();

		const item: IconifyMockAPI = {
			type: 'icons',
			provider,
			prefix,
			response: 404,
		};
		mockAPIData(item);

		// Make sure item is stored correctly
		expect(typeof iconsStorage[provider]).toBe('object');
		expect(iconsStorage[provider][prefix]).toEqual([item]);

		// Find item for icons
		const result = prepare(provider, prefix, ['foo', 'bar', 'baz']);
		expect(result).toEqual([
			{
				type: 'icons',
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
			type: 'icons',
			provider,
			prefix,
			response: 404,
			icons: ['foo', 'bar'],
		};
		const item2: IconifyMockAPI = {
			type: 'icons',
			provider,
			prefix,
			response: 404,
			icons: 'baz',
		};
		const item3: IconifyMockAPI = {
			type: 'icons',
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
		expect(typeof iconsStorage[provider]).toBe('object');
		expect(iconsStorage[provider][prefix]).toEqual([item1, item2, item3]);

		// Find items for icons
		const result = prepare(provider, prefix, [
			'foo',
			'baz',
			'bar',
			'test1',
			'test10',
			'test2',
		]);
		expect(result).toEqual([
			// Unknown icons first
			{
				type: 'icons',
				provider,
				prefix,
				icons: ['test1', 'test2'],
			},
			{
				type: 'icons',
				provider,
				prefix,
				icons: ['foo', 'bar'],
				index: 0,
			},
			{
				type: 'icons',
				provider,
				prefix,
				icons: ['baz'],
				index: 1,
			},
			{
				type: 'icons',
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
			type: 'icons',
			provider,
			prefix,
			response: 404,
			icons: ['foo'],
		};
		mockAPIData(item);

		// Make sure item is stored correctly
		expect(typeof iconsStorage[provider]).toBe('object');
		expect(iconsStorage[provider][prefix]).toEqual([item]);

		// Find item for icons
		const result = prepare(provider, prefix, ['foo', 'bar', 'baz']);
		expect(result).toEqual([
			// Missing icons first
			{
				type: 'icons',
				provider,
				prefix,
				icons: ['bar', 'baz'],
			},
			{
				type: 'icons',
				provider,
				prefix,
				icons: ['foo'],
				index: 0,
			},
		]);
	});
});
