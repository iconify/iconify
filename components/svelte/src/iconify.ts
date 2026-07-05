/**
 * Export required types
 */
// Function sets
export {
	IconifyStorageFunctions,
	IconifyBuilderFunctions,
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
} from './functions.js';

// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName } from './functions.js';

// Customisations
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyIconProps,
	IconProps,
	IconifyRenderMode,
} from './functions.js';

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
} from './functions.js';

// Builder functions
export { IconifyIconBuildResult } from './functions.js';

// Component params
export { IconifyIconOnLoad } from './functions.js';

// Functions
// Important: duplicate of global exports in Icon.svelte. When changing exports, they must be changed in both files.
export {
	iconLoaded,
	getIcon,
	listIcons,
	addIcon,
	addCollection,
} from './functions.js';

export {
	calculateSize,
	replaceIDs,
	clearIDCache,
	buildIcon,
} from './functions.js';

export {
	addAPIProvider,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
	_api,
} from './functions.js';
