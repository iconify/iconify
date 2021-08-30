/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PendingQueryItem } from '@cyberalien/redundancy';
import type {
	APIIconsQueryParams,
	APIQueryParams,
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
	provider: string;

	// Response
	// Number if error should be sent, JSON on success
	response: number | IconifyJSON | Record<string, unknown>;

	// Delay for response: in milliseconds or callback
	delay?: number | IconifyMockAPIDelayCallback;
}

export interface IconifyMockIconsAPI extends IconifyMockAPIBase {
	type: 'icons';

	// Request parameters
	prefix: string;

	// If icons list is missing, applies to all requests
	// If array, applies to any matching icon
	icons?: string | string[];

	// Response
	// Number if error should be sent, JSON on success
	response: number | IconifyJSON;
}

export type IconifyMockAPI = IconifyMockIconsAPI;

/**
 * Fake API storage
 *
 * [provider][prefix] = list of entries
 */
export const storage: Record<
	string,
	Record<string, IconifyMockAPI[]>
> = Object.create(null);

/**
 * Set data for mocking API
 */
export function mockAPIData(data: IconifyMockAPI): void {
	const provider = data.provider;
	if (storage[provider] === void 0) {
		storage[provider] = Object.create(null);
	}
	const providerStorage = storage[provider];

	const prefix = data.prefix;
	if (providerStorage[prefix] === void 0) {
		providerStorage[prefix] = [];
	}

	storage[provider][prefix].push(data);
}

interface MockAPIIconsQueryParams extends APIIconsQueryParams {
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
	): APIIconsQueryParams[] => {
		const type = 'icons';

		if (
			storage[provider] === void 0 ||
			storage[provider][prefix] === void 0
		) {
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
		const mockData = storage[provider][prefix];

		// Find catch all entry with error
		const catchAllIndex = mockData.findIndex(
			(item) => item.icons === void 0 && typeof item.response !== 'object'
		);

		// Find all icons
		const matches: Record<number, string[]> = Object.create(null);
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
		const results: APIIconsQueryParams[] = [];
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
			} as APIIconsQueryParams);
		});

		return results;
	},

	/**
	 * Load icons
	 */
	send: (host: string, params: APIQueryParams, status: PendingQueryItem) => {
		const provider = params.provider;
		let data: IconifyMockAPI;

		switch (params.type) {
			case 'icons': {
				const prefix = params.prefix;
				const index = (params as MockAPIIconsQueryParams).index;

				// Get item
				if (
					storage[provider] === void 0 ||
					storage[provider][prefix] === void 0 ||
					storage[provider][prefix][index] === void 0
				) {
					// No entry
					status.done(void 0, 404);
					return;
				}

				data = storage[provider][prefix][index];
				break;
			}

			default:
				// Fail: return 400 Bad Request
				status.done(void 0, 400);
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
			if (typeof data.response === 'number') {
				status.done(void 0, data.response);
			} else {
				status.done(data.response);
			}
		});
	},
};
