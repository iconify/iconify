import type { IconifyJSON } from '@iconify/types';

// Core
import {
	allowSimpleNames,
	IconifyStorageFunctions,
} from '@iconify/core/lib/storage/functions';
import {
	iconExists,
	getIcon,
	addIcon,
	addCollection,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { buildIcon } from '@iconify/core/lib/builder/functions';
import { calculateSize } from '@iconify/utils/lib/svg/size';

// API
import type {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
} from '@iconify/core/lib/api/functions';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import type { PartialIconifyAPIConfig } from '@iconify/core/lib/api/config';
import {
	addAPIProvider,
	getAPIConfig,
	listAPIProviders,
} from '@iconify/core/lib/api/config';
import {
	fetchAPIModule,
	setFetch,
	getFetch,
} from '@iconify/core/lib/api/modules/fetch';
import { loadIcons, loadIcon } from '@iconify/core/lib/api/icons';
import { sendAPIQuery } from '@iconify/core/lib/api/query';

// Cache
import { cache } from '@iconify/core/lib/cache';
import { storeCache } from '@iconify/core/lib/browser-storage';
import { loadBrowserStorageCache } from '@iconify/core/lib/browser-storage/load';
import { toggleBrowserCache } from '@iconify/core/lib/browser-storage/functions';
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';

/**
 * Interface for exported functions
 */
export interface IconifyExportedFunctions
	extends IconifyStorageFunctions,
		IconifyBuilderFunctions,
		IconifyBrowserCacheFunctions,
		IconifyAPIFunctions {
	_api: IconifyAPIInternalFunctions;
}

/**
 * Get functions and initialise stuff
 */
export function exportFunctions(): IconifyExportedFunctions {
	/**
	 * Initialise stuff
	 */
	// Set API module
	setAPIModule('', fetchAPIModule);

	// Allow simple icon names
	allowSimpleNames(true);

	/**
	 * Browser stuff
	 */
	interface WindowWithIconifyStuff {
		IconifyPreload?: IconifyJSON[] | IconifyJSON;
		IconifyProviders?: Record<string, PartialIconifyAPIConfig>;
	}
	let _window: WindowWithIconifyStuff;
	try {
		_window = window as WindowWithIconifyStuff;
	} catch (err) {
		//
	}
	if (_window) {
		// Set cache and load existing cache
		cache.store = storeCache;
		loadBrowserStorageCache();

		// Load icons from global "IconifyPreload"
		if (_window.IconifyPreload !== void 0) {
			const preload = _window.IconifyPreload;
			const err = 'Invalid IconifyPreload syntax.';
			if (typeof preload === 'object' && preload !== null) {
				(preload instanceof Array ? preload : [preload]).forEach(
					(item) => {
						try {
							if (
								// Check if item is an object and not null/array
								typeof item !== 'object' ||
								item === null ||
								item instanceof Array ||
								// Check for 'icons' and 'prefix'
								typeof item.icons !== 'object' ||
								typeof item.prefix !== 'string' ||
								// Add icon set
								!addCollection(item)
							) {
								console.error(err);
							}
						} catch (e) {
							console.error(err);
						}
					}
				);
			}
		}

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

	const _api: IconifyAPIInternalFunctions = {
		getAPIConfig,
		setAPIModule,
		sendAPIQuery,
		setFetch,
		getFetch,
		listAPIProviders,
	};

	return {
		enableCache: (storage: IconifyBrowserCacheType) =>
			toggleBrowserCache(storage, true),
		disableCache: (storage: IconifyBrowserCacheType) =>
			toggleBrowserCache(storage, false),
		iconExists,
		getIcon,
		listIcons,
		addIcon,
		addCollection,
		calculateSize,
		buildIcon,
		loadIcons,
		loadIcon,
		addAPIProvider,
		_api,
	};
}
