/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'mocha';
import { expect } from 'chai';
import type { PendingQueryItem } from '@iconify/api-redundancy';
import type { IconifyAPIConfig } from '../../lib/api/config';
import { setAPIConfig, getAPIConfig } from '../../lib/api/config';
import type {
	IconifyAPIIconsQueryParams,
	IconifyAPIQueryParams,
	IconifyAPIModule,
} from '../../lib/api/modules';
import { setAPIModule, getAPIModule } from '../../lib/api/modules';

describe('Testing API modules', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mod-test-' + (prefixCounter < 10 ? '0' : '') + prefixCounter
		);
	}

	const prepareQuery = (
		provider: string,
		prefix: string,
		icons: string[]
	): IconifyAPIIconsQueryParams[] => {
		const item: IconifyAPIIconsQueryParams = {
			type: 'icons',
			provider,
			prefix,
			icons,
		};
		return [item];
	};

	const sendQuery = (
		host: string,
		params: IconifyAPIQueryParams,
		item: PendingQueryItem
	): void => {
		throw new Error('Unexpected API call');
	};

	it('Empty module', () => {
		const provider = nextPrefix();

		// Set config
		setAPIConfig(provider, {
			resources: ['https://localhost:3000'],
			maxURL: 500,
		});

		// Set fake module
		setAPIModule(provider, {
			prepare: prepareQuery,
			send: sendQuery,
		});

		// Get config
		const config = getAPIConfig(provider) as IconifyAPIConfig;
		expect(config).to.not.be.equal(void 0);

		// Check setAPIConfig
		expect(config.resources).to.be.eql(['https://localhost:3000']);

		// Check getAPIModule()
		const item = getAPIModule(provider) as IconifyAPIModule;
		expect(item).to.not.be.equal(void 0);
		expect(item.prepare).to.be.equal(prepareQuery);
		expect(item.send).to.be.equal(sendQuery);

		// Get module for different provider to make sure it is empty
		const provider2 = nextPrefix();
		const item2 = getAPIModule(provider2);
		expect(item2).to.be.equal(void 0);
	});
});
