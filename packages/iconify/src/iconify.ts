// Core
import { IconifyJSON, IconifyIcon } from '@iconify/types';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
import { IconifyIconBuildResult } from '@iconify/core/lib/builder';
import {
	IconifyStorageFunctions,
	storageFunctions,
} from '@iconify/core/lib/storage/functions';
import {
	IconifyBuilderFunctions,
	builderFunctions,
} from '@iconify/core/lib/builder/functions';

// Modules
import { coreModules } from '@iconify/core/lib/modules';

// Cache
import { storeCache, loadCache } from '@iconify/core/lib/browser-storage/';
import {
	IconifyBrowserCacheFunctions,
	IconifyBrowserCacheType,
	toggleBrowserCache,
} from '@iconify/core/lib/browser-storage/functions';

// API
import {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
	APIFunctions,
	APIInternalFunctions,
} from '@iconify/core/lib/api/functions';
import { API, IconifyAPIInternalStorage } from '@iconify/core/lib/api/';
import {
	setAPIModule,
	IconifyAPIModule,
	IconifyAPISendQuery,
	IconifyAPIPrepareQuery,
	GetIconifyAPIModule,
} from '@iconify/core/lib/api/modules';
import {
	setAPIConfig,
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	getAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import { getAPIModule as getJSONPAPIModule } from '@iconify/core/lib/api/modules/jsonp';
import {
	getAPIModule as getFetchAPIModule,
	setFetch,
} from '@iconify/core/lib/api/modules/fetch';
import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';

// Other
import { IconifyCommonFunctions, commonFunctions } from './common';

/**
 * Export required types
 */
// Function sets
export {
	IconifyStorageFunctions,
	IconifyBuilderFunctions,
	IconifyBrowserCacheFunctions,
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
};

// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName };

// Customisations
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
};

// Build
export { IconifyIconBuildResult };

// API
export {
	IconifyAPIConfig,
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
	IconifyAPIInternalStorage,
	IconifyAPIModule,
	GetAPIConfig,
	IconifyAPIPrepareQuery,
	IconifyAPISendQuery,
	IconifyBrowserCacheType,
	PartialIconifyAPIConfig,
};

/**
 * Iconify interface
 */
export interface IconifyGlobal
	extends IconifyStorageFunctions,
		IconifyBuilderFunctions,
		IconifyCommonFunctions,
		IconifyBrowserCacheFunctions,
		IconifyAPIFunctions {
	_api: IconifyAPIInternalFunctions;
}

/**
 * Browser cache functions
 */
const browserCacheFunctions: IconifyBrowserCacheFunctions = {
	// enableCache() has optional second parameter for backwards compatibility
	enableCache: (storage: IconifyBrowserCacheType, enable?: boolean) =>
		toggleBrowserCache(storage, enable !== false),
	disableCache: (storage: IconifyBrowserCacheType) =>
		toggleBrowserCache(storage, true),
};

/**
 * Global variable
 */
const Iconify = {
	// Exposed internal API functions
	_api: APIInternalFunctions,
} as unknown as IconifyGlobal;

// Add functions
[
	storageFunctions,
	builderFunctions,
	commonFunctions,
	browserCacheFunctions,
	APIFunctions,
].forEach((list) => {
	for (const key in list) {
		Iconify[key] = list[key];
	}
});

/**
 * Initialise stuff
 */
// Set API
coreModules.api = API;

// Check for Fetch API
let getAPIModule: GetIconifyAPIModule = getFetchAPIModule;
try {
	if (typeof document !== 'undefined' && typeof window !== 'undefined') {
		// If window and document exist, attempt to load whatever module is available, otherwise use Fetch API
		getAPIModule =
			typeof fetch === 'function' && typeof Promise === 'function'
				? getFetchAPIModule
				: getJSONPAPIModule;
	}
} catch (err) {
	//
}
setAPIModule('', getAPIModule(getAPIConfig));

/**
 * Function to enable node-fetch for getting icons on server side
 */
Iconify._api.setFetch = (nodeFetch: typeof fetch) => {
	setFetch(nodeFetch);
	if (getAPIModule !== getFetchAPIModule) {
		getAPIModule = getFetchAPIModule;
		setAPIModule('', getAPIModule(getAPIConfig));
	}
};

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	coreModules.cache = storeCache;
	loadCache();

	interface WindowWithIconifyStuff {
		IconifyProviders?: Record<string, PartialIconifyAPIConfig>;
	}
	const _window = window as WindowWithIconifyStuff;

	// Set API from global "IconifyProviders"
	if (_window.IconifyProviders !== void 0) {
		const providers = _window.IconifyProviders;
		if (typeof providers === 'object' && providers !== null) {
			for (let key in providers) {
				const err = 'IconifyProviders[' + key + '] is invalid.';
				try {
					const value = providers[key];
					if (
						typeof value !== 'object' ||
						!value ||
						value.resources === void 0
					) {
						continue;
					}
					if (!setAPIConfig(key, value)) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			}
		}
	}
}

export default Iconify;
