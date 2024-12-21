import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon } from '@iconify/utils/lib/icon/name';
import type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
	getIconData,
	allowSimpleNames,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';

// API
import type {
	IconifyCustomIconLoader,
	IconifyCustomIconsLoader,
} from '@iconify/core/lib/api/types';
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
	setFetch,
	getFetch,
} from '@iconify/core/lib/api/modules/fetch';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/api/icons';
import { loadIcons, loadIcon } from '@iconify/core/lib/api/icons';
import {
	setCustomIconLoader,
	setCustomIconsLoader,
} from '@iconify/core/lib/api/loaders';
import { sendAPIQuery } from '@iconify/core/lib/api/query';

// Cache
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';

// Properties
import type {
	IconProps,
	IconifyIconCustomisations,
	IconifyIconProps,
	IconifyRenderMode,
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
	IconifyRenderMode,
	IconifyIconProps,
	IconProps,
};

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
	IconifyCustomIconLoader,
	IconifyCustomIconsLoader,
};

// Builder functions
export { IconifyIconBuildResult };

/* Browser cache */
export { IconifyBrowserCacheType };

/**
 * Enable cache
 *
 * @deprecated No longer used
 */
function enableCache(storage: IconifyBrowserCacheType): void {
	//
}

/**
 * Disable cache
 *
 * @deprecated No longer used
 */
function disableCache(storage: IconifyBrowserCacheType): void {
	//
}

/**
 * Initialise stuff
 */
// Enable short names
allowSimpleNames(true);

// Set API module
setAPIModule('', fetchAPIModule);

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
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
 * Function to get icon status
 */
interface IconLoadingState {
	name: string;
	abort: IconifyIconLoaderAbort;
}

type IconComponentData = IconifyIcon | null;

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
	mounted: boolean,
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
		return { data: { ...defaultIconProps, ...icon } };
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
	if (!data) {
		// Icon data is not available
		// Do not load icon until component is mounted
		if (mounted && (!state.loading || state.loading.name !== icon)) {
			// New icon to load
			abortLoading();
			state.name = '';
			state.loading = {
				name: icon,
				abort: loadIcons([iconName], callback),
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
	return icon
		? render(
				{
					...defaultIconProps,
					...icon,
				},
				props
		  )
		: null;
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
 * Export functions
 */
// IconifyAPIInternalFunctions
export { _api };

// IconifyAPIFunctions
export {
	addAPIProvider,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
};

// IconifyStorageFunctions
export {
	iconLoaded,
	iconLoaded as iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
};

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconifyBrowserCacheFunctions
export { enableCache, disableCache };
