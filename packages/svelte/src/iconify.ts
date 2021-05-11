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
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconProps,
	IconProps,
} from './functions';

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
} from './functions';

// Builder functions
export { RawIconCustomisations, IconifyIconBuildResult } from './functions';

// Browser cache
export { IconifyBrowserCacheType } from './functions';

// Component and params
export { default as Icon } from './Icon.svelte';
export { IconifyIconOnLoad } from './functions';

// Functions
export { enableCache, disableCache } from './functions';

export {
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,
} from './functions';

export { calculateSize, replaceIDs, buildIcon } from './functions';

export { loadIcons, addAPIProvider, _api } from './functions';
