// Core
import { IconifyJSON } from '@iconify/types';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { IconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';
import { IconifyIconBuildResult } from '@iconify/core/lib/builder';
import { calcSize } from '@iconify/core/lib/builder/calc-size';
import {
	IconifyStorageFunctions,
	storageFunctions,
} from '@iconify/core/lib/storage/functions';

// Modules
import { coreModules } from '@iconify/core/lib/modules';

// Cache
import {
	storeCache,
	loadCache,
	config,
} from '@iconify/core/lib/storage/browser';

// API
import {
	IconifyAPI,
	IconifyExposedAPIInternals,
	IconifyCacheType,
} from './modules/api';
import {
	API,
	getRedundancyCache,
	IconifyAPIInternalStorage,
} from '@iconify/core/lib/api/';
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
import { getAPIModule as getFetchAPIModule } from '@iconify/core/lib/api/modules/fetch';
import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';

// Other
import { IconifyExposedCommonInternals } from './internals';
import { IconifyCommonFunctions, commonFunctions } from './common';

/**
 * Export required types
 */
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
	IconifyCacheType,
};

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyExposedInternals
	extends IconifyExposedAPIInternals,
		IconifyExposedCommonInternals {}

/**
 * Exported functions
 */
export interface IconifyFunctions extends IconifyAPI {
	/**
	 * Expose internal functions
	 */
	_internal: IconifyExposedInternals;
}

/**
 * Iconify interface
 */
export interface IconifyGlobal
	extends IconifyStorageFunctions,
		IconifyCommonFunctions,
		IconifyFunctions {}

// Export dependencies
export { IconifyGlobal as IconifyGlobalCommon, IconifyAPI };

function toggleCache(storage: IconifyCacheType, value: boolean): void {
	switch (storage) {
		case 'local':
		case 'session':
			config[storage] = value;
			break;

		case 'all':
			for (const key in config) {
				config[key] = value;
			}
			break;
	}
}

/**
 * Global variable
 */
const Iconify: IconifyGlobal = ({
	// Load icons
	loadIcons: API.loadIcons,

	// API providers
	addAPIProvider: setAPIConfig,

	// Toggle storage
	enableCache: (storage: IconifyCacheType, value?: boolean) => {
		toggleCache(storage, typeof value === 'boolean' ? value : true);
	},
	disableCache: (storage: IconifyCacheType) => {
		toggleCache(storage, false);
	},

	// Exposed internal functions
	_internal: {
		// Calculate size
		calculateSize: calcSize,

		// Get API data
		getAPI: getRedundancyCache,

		// Get API config
		getAPIConfig,

		// Get API module
		setAPIModule,
	},
} as IconifyFunctions) as IconifyGlobal;

// Merge with common functions
[storageFunctions, commonFunctions].forEach((list) => {
	for (const key in list) {
		Iconify[key] = list[key];
	}
});

/**
 * Initialise stuff
 */
// Set API
coreModules.api = API;

let getAPIModule: GetIconifyAPIModule;
try {
	getAPIModule =
		typeof fetch === 'function' && typeof Promise === 'function'
			? getFetchAPIModule
			: getJSONPAPIModule;
} catch (err) {
	getAPIModule = getJSONPAPIModule;
}
setAPIModule('', getAPIModule(getAPIConfig));

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	coreModules.cache = storeCache;
	loadCache();

	const _window = window;

	// Set API from global "IconifyProviders"
	interface WindowWithIconifyProviders {
		IconifyProviders: Record<string, PartialIconifyAPIConfig>;
	}
	if (
		((_window as unknown) as WindowWithIconifyProviders)
			.IconifyProviders !== void 0
	) {
		const providers = ((_window as unknown) as WindowWithIconifyProviders)
			.IconifyProviders;
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
