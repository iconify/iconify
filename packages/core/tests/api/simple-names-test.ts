import { setAPIModule } from '../../lib/api/modules';
import { loadIcons } from '../../lib/api/icons';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { allowSimpleNames } from '../../lib/storage/functions';

describe('Testing simple names with API module', () => {
	// Set API config and allow simple names
	beforeEach(() => {
		allowSimpleNames(true);
		setAPIModule('', mockAPIModule);
	});

	afterAll(() => {
		allowSimpleNames(false);
	});

	it('Loading icons without prefix', () => {
		return new Promise((fulfill) => {
			mockAPIData({
				type: 'icons',
				provider: '',
				prefix: '',
				response: {
					prefix: '',
					icons: {
						test100: {
							body: '<g />',
						},
						test101: {
							body: '<g />',
						},
					},
				},
			});
			mockAPIData({
				type: 'icons',
				provider: '',
				prefix: 'test200',
				response: {
					prefix: 'test200',
					icons: {
						foo: {
							body: '<g />',
						},
						bar: {
							body: '<g />',
						},
					},
				},
			});

			loadIcons(
				[
					{
						provider: '',
						prefix: '',
						name: 'test100',
					},
					{
						provider: '',
						prefix: 'test200',
						name: 'foo',
					},
				],
				(loaded, missing, pending) => {
					// 'test100' should be missing because it does not have a prefix
					expect(loaded).toEqual([
						{
							provider: '',
							prefix: 'test200',
							name: 'foo',
						},
					]);
					expect(pending).toEqual([]);
					expect(missing).toEqual([
						{
							provider: '',
							prefix: '',
							name: 'test100',
						},
					]);
					fulfill(true);
				}
			);
		});
	});
});
