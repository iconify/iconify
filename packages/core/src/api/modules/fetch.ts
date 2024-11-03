import type { QueryModuleResponse } from '@iconify/api-redundancy';
import type {
	IconifyAPIQueryParams,
	IconifyAPIPrepareIconsQuery,
	IconifyAPISendQuery,
	IconifyAPIModule,
	IconifyAPIIconsQueryParams,
} from '../modules';
import { getAPIConfig } from '../config';

/**
 * Get fetch function
 */
type FetchType = typeof fetch;
const detectFetch = (): FetchType | undefined => {
	let callback;

	// Try global fetch
	try {
		callback = fetch;
		if (typeof callback === 'function') {
			return callback;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		//
	}
};

/**
 * Fetch function
 */
let fetchModule: FetchType | undefined = detectFetch();

/**
 * Set custom fetch() function
 */
export function setFetch(fetch: unknown): void {
	fetchModule = fetch as FetchType;
}

/**
 * Get fetch() function. Used by Icon Finder Core
 */
export function getFetch(): typeof fetchModule {
	return fetchModule;
}

/**
 * Calculate maximum icons list length for prefix
 */
function calculateMaxLength(provider: string, prefix: string): number {
	// Get config and store path
	const config = getAPIConfig(provider);
	if (!config) {
		return 0;
	}

	// Calculate
	let result;
	if (!config.maxURL) {
		result = 0;
	} else {
		let maxHostLength = 0;
		config.resources.forEach((item) => {
			const host = item;
			maxHostLength = Math.max(maxHostLength, host.length);
		});

		// Get available length
		const url = prefix + '.json?icons=';

		result =
			config.maxURL - maxHostLength - config.path.length - url.length;
	}

	// Return result
	return result;
}

/**
 * Should query be aborted, based on last HTTP status
 */
function shouldAbort(status: number): boolean {
	return status === 404;
}

/**
 * Prepare params
 */
const prepare: IconifyAPIPrepareIconsQuery = (
	provider: string,
	prefix: string,
	icons: string[]
): IconifyAPIIconsQueryParams[] => {
	const results: IconifyAPIIconsQueryParams[] = [];

	// Get maximum icons list length
	const maxLength = calculateMaxLength(provider, prefix);

	// Split icons
	const type = 'icons';
	let item: IconifyAPIIconsQueryParams = {
		type,
		provider,
		prefix,
		icons: [],
	};
	let length = 0;
	icons.forEach((name, index) => {
		length += name.length + 1;
		if (length >= maxLength && index > 0) {
			// Next set
			results.push(item);
			item = {
				type,
				provider,
				prefix,
				icons: [],
			};
			length = name.length;
		}

		item.icons.push(name);
	});
	results.push(item);

	return results;
};

/**
 * Get path
 */
function getPath(provider?: string): string {
	if (typeof provider === 'string') {
		const config = getAPIConfig(provider);
		if (config) {
			return config.path;
		}
	}

	// No provider config, assume path is '/'
	return '/';
}

/**
 * Load icons
 */
const send: IconifyAPISendQuery = (
	host: string,
	params: IconifyAPIQueryParams,
	callback: QueryModuleResponse
): void => {
	if (!fetchModule) {
		// Fail: return "424 Failed Dependency" (its not meant to be used like that, but it is the closest match)
		callback('abort', 424);
		return;
	}

	// Get path
	let path = getPath(params.provider);
	switch (params.type) {
		case 'icons': {
			const prefix = params.prefix;
			const icons = params.icons;
			const iconsList = icons.join(',');

			const urlParams = new URLSearchParams({
				icons: iconsList,
			});
			path += prefix + '.json?' + urlParams.toString();
			break;
		}

		case 'custom': {
			const uri = params.uri;
			path += uri.slice(0, 1) === '/' ? uri.slice(1) : uri;
			break;
		}

		default:
			// Fail: return 400 Bad Request
			callback('abort', 400);
			return;
	}

	// Error code to return if fetch throws an error: "503 Service Unavailable"
	let defaultError = 503;

	// console.log('API query:', host + path);
	fetchModule(host + path)
		.then((response) => {
			const status = response.status;
			if (status !== 200) {
				setTimeout(() => {
					// Complete on next tick to get out of try...catch
					callback(shouldAbort(status) ? 'abort' : 'next', status);
				});
				return;
			}

			// Parse JSON, fail with "501 Not Implemented" if response cannot be decoded
			defaultError = 501;
			return response.json();
		})
		.then((data) => {
			if (typeof data !== 'object' || data === null) {
				setTimeout(() => {
					// Complete on next tick to get out of try...catch
					if (data === 404) {
						callback('abort', data);
					} else {
						callback('next', defaultError);
					}
				});
				return;
			}

			// Store cache and complete on next tick
			setTimeout(() => {
				// Complete on next tick to get out of try...catch
				callback('success', data);
			});
		})
		.catch(() => {
			callback('next', defaultError);
		});
};

/**
 * Export module
 */
export const fetchAPIModule: IconifyAPIModule = {
	prepare,
	send,
};
