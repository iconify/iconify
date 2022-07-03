/* eslint-disable @typescript-eslint/no-unused-vars */
import type { QueryModuleResponse } from '@iconify/api-redundancy';
import type {
	IconifyAPIIconsQueryParams,
	IconifyAPIQueryParams,
	IconifyAPIModule,
} from '../modules';
import type { IconifyJSON } from '@iconify/types';

/**
 * Callback for API delay
 */
export type IconifyMockAPIDelayDoneCallback = () => void;
export type IconifyMockAPIDelayCallback = (
	next: IconifyMockAPIDelayDoneCallback
) => void;

/**
 * Fake API result
 */
interface IconifyMockAPIBase {
	// Response
	// Number if error should be sent, JSON on success
	response: number | IconifyJSON | Record<string, unknown>;

	// Delay for response: in milliseconds or callback
	delay?: number | IconifyMockAPIDelayCallback;
}

export interface IconifyMockIconsAPI extends IconifyMockAPIBase {
	type: 'icons';
	provider: string;

	// Request parameters
	prefix: string;

	// If icons list is missing, applies to all requests
	// If array, applies to any matching icon
	icons?: string | string[];

	// Response
	// Number if error should be sent, JSON on success
	response: number | IconifyJSON;
}

export interface IconifyMockCustomAPI extends IconifyMockAPIBase {
	type: 'custom';
	provider: string;

	// Request parameters
	uri: string;

	// Response
	// Number if error should be sent, JSON on success
	response: number | Record<string, unknown>;
}

export interface IconifyMockCustomHostAPI extends IconifyMockAPIBase {
	type: 'host';
	host: string;

	// Request parameters
	uri: string;

	// Response
	// Number if error should be sent, JSON on success
	response: number | Record<string, unknown>;
}

export type IconifyMockAPI =
	| IconifyMockIconsAPI
	| IconifyMockCustomAPI
	| IconifyMockCustomHostAPI;

/**
 * Fake API storage for icons
 *
 * [provider][prefix] = list of entries
 */
export const iconsStorage: Record<
	string,
	Record<string, IconifyMockIconsAPI[]>
> = {};

/**
 * Fake API storage for custom queries
 *
 * [provider][uri] = response
 */
export const customProviderStorage: Record<
	string,
	Record<string, IconifyMockCustomAPI>
> = {};

/**
 * Fake API storage for custom queries
 *
 * [host][uri] = response
 */
export const customHostStorage: Record<
	string,
	Record<string, IconifyMockCustomHostAPI>
> = {};

/**
 * Set data for mocking API
 */
export function mockAPIData(data: IconifyMockAPI): void {
	switch (data.type) {
		case 'icons': {
			const provider = data.provider;
			const prefix = data.prefix;

			const providerStorage =
				iconsStorage[provider] ||
				(iconsStorage[provider] = Object.create(null) as Record<
					string,
					IconifyMockIconsAPI[]
				>);

			(providerStorage[prefix] || (providerStorage[prefix] = [])).push(
				data
			);
			break;
		}

		case 'custom': {
			const provider = data.provider;

			const providerStorage =
				customProviderStorage[provider] ||
				(customProviderStorage[provider] = Object.create(
					null
				) as Record<string, IconifyMockCustomAPI>);

			providerStorage[data.uri] = data;
			break;
		}

		case 'host': {
			const host = data.host;

			const hostStorage =
				customHostStorage[host] ||
				(customHostStorage[host] = Object.create(null) as Record<
					string,
					IconifyMockCustomHostAPI
				>);

			hostStorage[data.uri] = data;
			break;
		}
	}
}

interface MockAPIIconsQueryParams extends IconifyAPIIconsQueryParams {
	index: number;
}

/**
 * Return API module
 */
export const mockAPIModule: IconifyAPIModule = {
	/**
	 * Prepare params
	 */
	prepare: (
		provider: string,
		prefix: string,
		icons: string[]
	): IconifyAPIIconsQueryParams[] => {
		const type = 'icons';

		if (!iconsStorage[provider] || !iconsStorage[provider][prefix]) {
			// No mock data: bundle all icons in one request that will return 404
			return [
				{
					type,
					provider,
					prefix,
					icons,
				},
			];
		}
		const mockData = iconsStorage[provider][prefix];

		// Find catch all entry with error
		const catchAllIndex = mockData.findIndex(
			(item) => item.icons === void 0 && typeof item.response !== 'object'
		);

		// Find all icons
		const matches: Record<number, string[]> = {};
		const noMatch: string[] = [];
		icons.forEach((name) => {
			let index = mockData.findIndex((item) => {
				if (item.icons === void 0) {
					const response = item.response;
					if (typeof response === 'object') {
						return (
							(response.icons &&
								response.icons[name] !== void 0) ||
							(response.aliases &&
								response.aliases[name] !== void 0)
						);
					}
					return false;
				}
				const iconsList = item.icons;
				if (typeof iconsList === 'string') {
					return iconsList === name;
				}
				if (iconsList instanceof Array) {
					return iconsList.indexOf(name) !== -1;
				}
				return false;
			});

			if (index === -1) {
				index = catchAllIndex;
			}

			if (index === -1) {
				// Not found
				noMatch.push(name);
			} else {
				if (matches[index] === void 0) {
					matches[index] = [];
				}
				matches[index].push(name);
			}
		});

		// Sort results
		const results: IconifyAPIIconsQueryParams[] = [];
		if (noMatch.length > 0) {
			results.push({
				type,
				provider,
				prefix,
				icons: noMatch,
			});
		}
		Object.keys(matches).forEach((key) => {
			const index = parseInt(key);
			results.push({
				type,
				provider,
				prefix,
				icons: matches[index],
				index,
			} as IconifyAPIIconsQueryParams);
		});

		return results;
	},

	/**
	 * Load icons
	 */
	send: (
		host: string,
		params: IconifyAPIQueryParams,
		queryCallback: QueryModuleResponse
	) => {
		const provider = params.provider;
		let data: IconifyMockAPI;

		switch (params.type) {
			case 'icons': {
				if (provider === void 0) {
					// Fail: return 400 Bad Request
					queryCallback('abort', 400);
					return;
				}
				const index = (params as MockAPIIconsQueryParams).index;
				data = iconsStorage[provider]?.[params.prefix]?.[index];
				break;
			}

			case 'custom': {
				data = (
					provider === void 0
						? customHostStorage[host]
						: customProviderStorage[provider]
				)?.[params.uri];
				break;
			}

			default:
				// Fail: return 400 Bad Request
				queryCallback('abort', 400);
				return;
		}

		if (data === void 0) {
			queryCallback('abort', 404);
			return;
		}

		// Get delay
		const delay = data.delay;
		let callback: IconifyMockAPIDelayCallback;
		switch (typeof delay) {
			case 'function':
				callback = delay;
				break;

			case 'number':
				callback = (next) => setTimeout(next, delay);
				break;

			default:
				callback = (next) => next();
				break;
		}

		// Run after delay
		callback(() => {
			queryCallback(
				typeof data.response === 'number' ? 'next' : 'success',
				data.response
			);
		});
	},
};
