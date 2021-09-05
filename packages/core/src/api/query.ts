import type {
	Redundancy,
	QueryDoneCallback,
	QueryAbortCallback,
	QueryModuleCallback,
} from '@cyberalien/redundancy';
import { initRedundancy } from '@cyberalien/redundancy';
import {
	getAPIModule,
	IconifyAPIQueryParams,
	IconifyAPISendQuery,
} from './modules';
import {
	createAPIConfig,
	IconifyAPIConfig,
	PartialIconifyAPIConfig,
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
const redundancyCache: Record<string, IconifyAPIInternalStorage> =
	Object.create(null);

/**
 * Get Redundancy instance for provider
 */
function getRedundancyCache(
	provider: string
): IconifyAPIInternalStorage | undefined {
	if (redundancyCache[provider] === void 0) {
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

			// Use default API provider
			const api = getAPIModule('');
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
