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
} from './functions';

// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName } from './functions';

// Customisations
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyIconProps,
	IconProps,
	IconifyRenderMode,
} from './functions';

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
} from './functions';

// Builder functions
export { IconifyIconBuildResult } from './functions';

// Browser cache
export { IconifyBrowserCacheType } from './functions';

// Component params
export { IconifyIconOnLoad } from './functions';

// Functions
// Important: duplicate of global exports in Icon.svelte. When changing exports, they must be changed in both files.
export { enableCache, disableCache } from './functions';

export {
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
} from './functions';

export { calculateSize, replaceIDs, buildIcon } from './functions';

export {
	addAPIProvider,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
	_api,
} from './functions';
