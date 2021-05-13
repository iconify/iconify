import type { IconifyJSON } from '@iconify/types';

// Core
import { IconifyIconName, stringToIcon } from '@iconify/core/lib/icon/name';
import type {
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';
import {
	IconifyStorageFunctions,
	storageFunctions,
	getIconData,
	allowSimpleNames,
} from '@iconify/core/lib/storage/functions';
import {
	IconifyBuilderFunctions,
	builderFunctions,
} from '@iconify/core/lib/builder/functions';
import type { IconifyIconBuildResult } from '@iconify/core/lib/builder';
import { fullIcon, IconifyIcon } from '@iconify/core/lib/icon';

// Modules
import { coreModules } from '@iconify/core/lib/modules';

// API
import { API, IconifyAPIInternalStorage } from '@iconify/core/lib/api/';
import {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
	APIFunctions,
	APIInternalFunctions,
} from '@iconify/core/lib/api/functions';
import {
	setAPIModule,
	IconifyAPIModule,
	IconifyAPISendQuery,
	IconifyAPIPrepareQuery,
	GetIconifyAPIModule,
} from '@iconify/core/lib/api/modules';
import { getAPIModule as getJSONPAPIModule } from '@iconify/core/lib/api/modules/jsonp';
import {
	getAPIModule as getFetchAPIModule,
	setFetch,
} from '@iconify/core/lib/api/modules/fetch';
import {
	setAPIConfig,
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	getAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';

// Cache
import { storeCache, loadCache } from '@iconify/core/lib/browser-storage';
import { toggleBrowserCache } from '@iconify/core/lib/browser-storage/functions';
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';

// Properties
import type {
	RawIconCustomisations,
	IconProps,
	IconifyIconCustomisations,
	IconifyIconProps,
} from './props';

// Render SVG
import { render } from './render';
import type { RenderResult } from './render';

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
	IconifyIconProps,
	IconProps,
};

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
	PartialIconifyAPIConfig,
};

// Builder functions
export { RawIconCustomisations, IconifyIconBuildResult };

/* Browser cache */
export { IconifyBrowserCacheType };

/**
 * Enable and disable browser cache
 */
export const enableCache = (storage: IconifyBrowserCacheType) =>
	toggleBrowserCache(storage, true);

export const disableCache = (storage: IconifyBrowserCacheType) =>
	toggleBrowserCache(storage, false);

/* Storage functions */
/**
 * Check if icon exists
 */
export const iconExists = storageFunctions.iconExists;

/**
 * Get icon data
 */
export const getIcon = storageFunctions.getIcon;

/**
 * List available icons
 */
export const listIcons = storageFunctions.listIcons;

/**
 * Add one icon
 */
export const addIcon = storageFunctions.addIcon;

/**
 * Add icon set
 */
export const addCollection = storageFunctions.addCollection;

/* Builder functions */
/**
 * Calculate icon size
 */
export const calculateSize = builderFunctions.calculateSize;

/**
 * Replace unique ids in content
 */
export const replaceIDs = builderFunctions.replaceIDs;

/**
 * Build SVG
 */
export const buildIcon = builderFunctions.buildIcon;

/* API functions */
/**
 * Load icons
 */
export const loadIcons = APIFunctions.loadIcons;

/**
 * Add API provider
 */
export const addAPIProvider = APIFunctions.addAPIProvider;

/**
 * Export internal functions that can be used by third party implementations
 */
export const _api = APIInternalFunctions;

/**
 * Initialise stuff
 */
// Enable short names
allowSimpleNames(true);

// Set API
coreModules.api = API;

// Use Fetch API by default
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
_api.setFetch = (nodeFetch: typeof fetch) => {
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
		IconifyPreload?: IconifyJSON[] | IconifyJSON;
		IconifyProviders?: Record<string, PartialIconifyAPIConfig>;
	}
	const _window = window as WindowWithIconifyStuff;

	// Load icons from global "IconifyPreload"
	if (_window.IconifyPreload !== void 0) {
		const preload = _window.IconifyPreload;
		const err = 'Invalid IconifyPreload syntax.';
		if (typeof preload === 'object' && preload !== null) {
			(preload instanceof Array ? preload : [preload]).forEach((item) => {
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
			});
		}
	}

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

/**
 * Function to get icon status
 */
interface IconLoadingState {
	name: string;
	abort: IconifyIconLoaderAbort;
}

type IconComponentData = Required<IconifyIcon> | null;

interface IconState {
	// Last icon name
	name: string;

	// Loading status
	loading: IconLoadingState | null;

	// True when component has been destroyed
	destroyed: boolean;
}

type IconStateCallback = () => void;

/**
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
export type IconifyIconOnLoad = (name: string) => void;

/**
 * checkIconState result
 */
export interface CheckIconStateResult {
	data: IconComponentData;
	classes?: string[];
}

/**
 * Check if component needs to be updated
 */
export function checkIconState(
	icon: string | IconifyIcon,
	state: IconState,
	callback: IconStateCallback,
	onload?: IconifyIconOnLoad
): CheckIconStateResult | null {
	// Abort loading icon
	function abortLoading() {
		if (state.loading) {
			state.loading.abort();
			state.loading = null;
		}
	}

	// Icon is an object
	if (
		typeof icon === 'object' &&
		icon !== null &&
		typeof icon.body === 'string'
	) {
		// Stop loading
		state.name = '';
		abortLoading();
		return { data: fullIcon(icon) };
	}

	// Invalid icon?
	let iconName: IconifyIconName | null;
	if (
		typeof icon !== 'string' ||
		(iconName = stringToIcon(icon, false, true)) === null
	) {
		abortLoading();
		return null;
	}

	// Load icon
	const data = getIconData(iconName);
	if (data === null) {
		// Icon needs to be loaded
		if (!state.loading || state.loading.name !== icon) {
			// New icon to load
			abortLoading();
			state.name = '';
			state.loading = {
				name: icon,
				abort: API.loadIcons([iconName], callback),
			};
		}
		return null;
	}

	// Icon data is available
	abortLoading();
	if (state.name !== icon) {
		state.name = icon;
		if (onload && !state.destroyed) {
			onload(icon);
		}
	}

	// Add classes
	const classes: string[] = ['iconify'];
	if (iconName.prefix !== '') {
		classes.push('iconify--' + iconName.prefix);
	}
	if (iconName.provider !== '') {
		classes.push('iconify--' + iconName.provider);
	}

	return { data, classes };
}

/**
 * Generate icon
 */
export function generateIcon(
	icon: IconComponentData,
	props: IconProps
): RenderResult | null {
	return icon ? render(icon, props) : null;
}
