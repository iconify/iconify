/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import { setAPIConfig } from '../../lib/api/config';
import { setAPIModule } from '../../lib/api/modules';
import { API } from '../../lib/api/';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { allowSimpleNames } from '../../lib/storage/functions';

describe('Testing simple names with API module', () => {
	// Set API config and allow simple names
	before(() => {
		setAPIConfig('', {
			resources: ['https://api1.local'],
		});
		allowSimpleNames(true);
		setAPIModule('', mockAPIModule);
	});

	after(() => {
		allowSimpleNames(false);
	});

	it('Loading icons without prefix', (done) => {
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

		API.loadIcons(
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
				expect(loaded).to.be.eql([
					{
						provider: '',
						prefix: 'test200',
						name: 'foo',
					},
				]);
				expect(pending).to.be.eql([]);
				expect(missing).to.be.eql([
					{
						provider: '',
						prefix: '',
						name: 'test100',
					},
				]);
				done();
			}
		);
	});
});
