import { RedundancyPendingItem } from '@cyberalien/redundancy';
import {
	APIQueryParams,
	IconifyAPIPrepareQuery,
	IconifyAPISendQuery,
} from '@iconify/core/lib/api/modules';
import { IconifyJSON } from '@iconify/types';

/**
 * Fake data entry
 */
export interface FakeData {
	icons: string[];
	host?: string; // host to respond to
	delay?: number; // 0 = instant reply
	data: IconifyJSON; // data to send
}

/**
 * Fake data storage
 */
const fakeData: Record<string, Record<string, FakeData[]>> = Object.create(
	null
);

export function setFakeData(
	provider: string,
	prefix: string,
	item: FakeData
): void {
	if (fakeData[provider] === void 0) {
		fakeData[provider] = Object.create(null);
	}
	const providerFakeData = fakeData[provider];
	if (providerFakeData[prefix] === void 0) {
		providerFakeData[prefix] = [];
	}
	providerFakeData[prefix].push(item);
}

interface FakeAPIQueryParams extends APIQueryParams {
	data: FakeData;
}

/**
 * Prepare params
 */
export const prepareQuery: IconifyAPIPrepareQuery = (
	provider: string,
	prefix: string,
	icons: string[]
): APIQueryParams[] => {
	// Find items that have query
	const items: APIQueryParams[] = [];
	let missing = icons.slice(0);

	if (fakeData[provider] === void 0) {
		fakeData[provider] = Object.create(null);
	}
	const providerFakeData = fakeData[provider];

	if (providerFakeData[prefix] !== void 0) {
		providerFakeData[prefix].forEach((item) => {
			const matches = item.icons.filter(
				(icon) => missing.indexOf(icon) !== -1
			);
			if (!matches.length) {
				// No match
				return;
			}

			// Contains at least one matching icon
			missing = missing.filter((icon) => matches.indexOf(icon) === -1);
			const query: FakeAPIQueryParams = {
				provider,
				prefix,
				icons: matches,
				data: item,
			};
			items.push(query);
		});
	}

	return items;
};

/**
 * Load icons
 */
export const sendQuery: IconifyAPISendQuery = (
	host: string,
	params: APIQueryParams,
	status: RedundancyPendingItem
): void => {
	const provider = params.provider;
	const prefix = params.prefix;
	const icons = params.icons;

	const data = (params as FakeAPIQueryParams).data;
	if (!data) {
		throw new Error('Fake data is missing in query params');
	}
	if (typeof data.host === 'string' && data.host !== host) {
		// Host mismatch - do nothing
		return;
	}

	const sendResponse = () => {
		console.log(
			'Sending data for prefix "' +
				(provider === '' ? '' : '@' + provider + ':') +
				prefix +
				'", icons:',
			icons
		);
		status.done(data.data);
	};

	if (!data.delay) {
		sendResponse();
	} else {
		setTimeout(sendResponse, data.delay);
	}
};
