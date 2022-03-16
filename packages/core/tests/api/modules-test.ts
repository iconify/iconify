import type { IconifyAPIConfig } from '../../lib/api/config';
import { addAPIProvider, getAPIConfig } from '../../lib/api/config';
import type {
	IconifyAPIIconsQueryParams,
	IconifyAPIModule,
} from '../../lib/api/modules';
import { setAPIModule, getAPIModule } from '../../lib/api/modules';

describe('Testing API modules', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mod-test-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
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

	const sendQuery = (): void => {
		throw new Error('Unexpected API call');
	};

	it('Empty module', () => {
		const provider = nextPrefix();

		// Set config
		addAPIProvider(provider, {
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
		expect(config).not.toBeUndefined();

		// Check setAPIConfig
		expect(config.resources).toEqual(['https://localhost:3000']);

		// Check getAPIModule()
		const item = getAPIModule(provider) as IconifyAPIModule;
		expect(item).not.toBeUndefined();
		expect(item.prepare).toBe(prepareQuery);
		expect(item.send).toBe(sendQuery);

		// Get module for different provider to make sure it is different
		const provider2 = nextPrefix();
		const item2 = getAPIModule(provider2);
		expect(item2).not.toBe(item);
	});
});
