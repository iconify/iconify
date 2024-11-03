import type {
	Redundancy,
	QueryDoneCallback,
	QueryAbortCallback,
	QueryModuleCallback,
} from '@iconify/api-redundancy';
import { initRedundancy } from '@iconify/api-redundancy';
import {
	getAPIModule,
	type IconifyAPIQueryParams,
	type IconifyAPISendQuery,
} from './modules';
import {
	createAPIConfig,
	type IconifyAPIConfig,
	type PartialIconifyAPIConfig,
} from './config';
import { getAPIConfig } from './config';

// Empty abort callback
function emptyCallback(): void {
	// Do nothing
}

// Redundancy instances cache, sorted by provider
interface IconifyAPIInternalStorage {
	config: IconifyAPIConfig;
	redundancy: Redundancy;
}
const redundancyCache = Object.create(null) as Record<
	string,
	IconifyAPIInternalStorage
>;

/**
 * Get Redundancy instance for provider
 */
function getRedundancyCache(
	provider: string
): IconifyAPIInternalStorage | undefined {
	if (!redundancyCache[provider]) {
		const config = getAPIConfig(provider);
		if (!config) {
			// Configuration is not set!
			return;
		}

		const redundancy = initRedundancy(config);
		const cachedReundancy = {
			config,
			redundancy,
		};
		redundancyCache[provider] = cachedReundancy;
	}

	return redundancyCache[provider];
}

/**
 * Send API query
 */
export function sendAPIQuery(
	target: string | PartialIconifyAPIConfig,
	query: IconifyAPIQueryParams,
	callback: QueryDoneCallback
): QueryAbortCallback {
	let redundancy: Redundancy | undefined;
	let send: IconifyAPISendQuery | undefined;

	if (typeof target === 'string') {
		// Get API module
		const api = getAPIModule(target);
		if (!api) {
			// No API module
			// Return "424 Failed Dependency" (its not meant to be used like that, but it is the closest match)
			callback(void 0, 424);
			return emptyCallback;
		}
		send = api.send;

		// Get Redundancy instance
		const cached = getRedundancyCache(target);
		if (cached) {
			redundancy = cached.redundancy;
		}
	} else {
		const config = createAPIConfig(target);
		if (config) {
			redundancy = initRedundancy(config);

			// Use host instead of API provider (defaults to '')
			const moduleKey = target.resources ? target.resources[0] : '';
			const api = getAPIModule(moduleKey);
			if (api) {
				send = api.send;
			}
		}
	}

	if (!redundancy || !send) {
		// No way to load icons because configuration is not set!
		callback(void 0, 424);
		return emptyCallback;
	}

	// Send API query, return function to abort query
	return redundancy.query(query, send as QueryModuleCallback, callback)()
		.abort;
}
