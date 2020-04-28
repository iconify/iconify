/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import { RedundancyPendingItem } from '@cyberalien/redundancy';
import {
	setAPIConfig,
	getAPIConfig,
	IconifyAPIConfig,
} from '../../lib/api/config';
import {
	setAPIModule,
	APIQueryParams,
	getAPIModule,
	IconifyAPIModule,
} from '../../lib/api/modules';

describe('Testing API modules', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mod-test-' + (prefixCounter < 10 ? '0' : '') + prefixCounter
		);
	}

	const prepareQuery = (
		prefix: string,
		icons: string[]
	): APIQueryParams[] => {
		const item: APIQueryParams = {
			prefix,
			icons,
		};
		return [item];
	};

	const sendQuery = (
		host: string,
		params: APIQueryParams,
		status: RedundancyPendingItem
	): void => {
		throw new Error('Unexpected API call');
	};

	it('Empty module', () => {
		const prefix = nextPrefix();

		// Set config
		setAPIConfig(
			{
				resources: ['https://localhost:3000'],
				maxURL: 500,
			},
			prefix
		);

		// Set fake module
		setAPIModule(
			{
				prepare: prepareQuery,
				send: sendQuery,
			},
			prefix
		);

		// Get config
		const config = getAPIConfig(prefix) as IconifyAPIConfig;
		expect(config).to.not.be.equal(null);

		// Check setAPIConfig
		expect(config.resources).to.be.eql(['https://localhost:3000']);

		// Check getAPIModule()
		const item = getAPIModule(prefix) as IconifyAPIModule;
		expect(item).to.not.be.equal(null);
		expect(item.prepare).to.be.equal(prepareQuery);
		expect(item.send).to.be.equal(sendQuery);

		// Get module for different prefix to make sure it is empty
		const prefix2 = nextPrefix();
		const item2 = getAPIModule(prefix2);
		expect(item2).to.be.equal(null);
	});
});
