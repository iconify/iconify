// Core
import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import {
	iconExists,
	getIcon,
	addIcon,
	addCollection,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { buildIcon } from '@iconify/core/lib/builder/functions';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { calculateSize } from '@iconify/utils/lib/svg/size';

// Cache
import { initBrowserStorage } from '@iconify/core/lib/browser-storage';
import type {
	IconifyBrowserCacheFunctions,
	IconifyBrowserCacheType,
} from '@iconify/core/lib/browser-storage/functions';
import { toggleBrowserCache } from '@iconify/core/lib/browser-storage/functions';

// API
import type {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
} from '@iconify/core/lib/api/functions';
import type {
	IconifyAPIModule,
	IconifyAPISendQuery,
	IconifyAPIPrepareIconsQuery,
} from '@iconify/core/lib/api/modules';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import type {
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import {
	addAPIProvider,
	getAPIConfig,
	listAPIProviders,
} from '@iconify/core/lib/api/config';
import {
	fetchAPIModule,
	getFetch,
	setFetch,
} from '@iconify/core/lib/api/modules/fetch';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/api/icons';
import { loadIcons, loadIcon } from '@iconify/core/lib/api/icons';
import { sendAPIQuery } from '@iconify/core/lib/api/query';

// Other
import type { IconifyCommonFunctions } from './common';
import { getVersion, renderSVG, renderHTML, renderIcon, scan } from './common';
import {
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
} from './observer/index';
import type {
	IconifyRenderMode,
	IconifyIconCustomisations,
} from './scanner/config';

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
export { IconifyIconCustomisations, IconifyIconSize, IconifyRenderMode };

// Build
export { IconifyIconBuildResult };

// API
export {
	IconifyAPIConfig,
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
	IconifyAPIModule,
	GetAPIConfig,
	IconifyAPIPrepareIconsQuery,
	IconifyAPISendQuery,
	PartialIconifyAPIConfig,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
};

// Cache
export { IconifyBrowserCacheType };

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
 * Enable cache
 */
function enableCache(storage: IconifyBrowserCacheType, enable?: boolean): void {
	toggleBrowserCache(storage, enable !== false);
}

/**
 * Disable cache
 */
function disableCache(storage: IconifyBrowserCacheType): void {
	toggleBrowserCache(storage, true);
}

/**
 * Initialise stuff
 */
// Set API module
setAPIModule('', fetchAPIModule);

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	initBrowserStorage();

	interface WindowWithIconifyStuff {
		IconifyProviders?: Record<string, PartialIconifyAPIConfig>;
	}
	const _window = window as WindowWithIconifyStuff;

	// Set API from global "IconifyProviders"
	if (_window.IconifyProviders !== void 0) {
		const providers = _window.IconifyProviders;
		if (typeof providers === 'object' && providers !== null) {
			for (const key in providers) {
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
					if (!addAPIProvider(key, value)) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			}
		}
	}
}

/**
 * Internal API
 */
const _api: IconifyAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	setFetch,
	getFetch,
	listAPIProviders,
};

/**
 * Global variable
 */
const Iconify: IconifyGlobal = {
	// IconifyAPIInternalFunctions
	_api,

	// IconifyAPIFunctions
	addAPIProvider,
	loadIcons,
	loadIcon,

	// IconifyStorageFunctions
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,

	// IconifyBuilderFunctions
	replaceIDs,
	calculateSize,
	buildIcon,

	// IconifyCommonFunctions
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,

	// IconifyBrowserCacheFunctions
	enableCache,
	disableCache,
};

/**
 * Default export
 */
export default Iconify;

/**
 * Named exports
 */
// IconifyAPIInternalFunctions
export { _api };

// IconifyAPIFunctions
export { addAPIProvider, loadIcons, loadIcon };

// IconifyStorageFunctions
export { iconExists, getIcon, listIcons, addIcon, addCollection };

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconifyCommonFunctions
export {
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
};

// IconifyBrowserCacheFunctions
export { enableCache, disableCache };
