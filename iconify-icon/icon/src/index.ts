import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconSize,
	IconifyIconCustomisations,
} from '@iconify/utils/lib/customisations/defaults';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';

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
import type {
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/api/icons';

// Cache
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';

// Component
import type {
	IconifyIconProperties,
	IconifyIconAttributes,
	IconifyRenderMode,
} from './attributes/types';
import { defineIconifyIcon } from './component';
import type {
	IconifyIconHTMLElement,
	IconifyIconHTMLElementClass,
} from './component';
import { exportFunctions } from './functions';
import { appendCustomStyle } from './render/style';

/**
 * Export used types
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
export { IconifyIconCustomisations, IconifyIconSize };

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

// Browser cache
export { IconifyBrowserCacheType };

// Component types
export {
	IconifyIconProperties,
	IconifyIconAttributes,
	IconifyRenderMode,
	IconifyIconHTMLElement,
	IconifyIconHTMLElementClass,
};

/**
 * Create exported data: either component instance or functions
 */
export const IconifyIconComponent = defineIconifyIcon() || exportFunctions();

/**
 * Export functions
 */
const {
	enableCache,
	disableCache,
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	buildIcon,
	iconToHTML,
	svgToURL,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
	addAPIProvider,
	_api,
} = IconifyIconComponent;

export {
	enableCache,
	disableCache,
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	buildIcon,
	iconToHTML,
	svgToURL,
	loadIcons,
	loadIcon,
	addAPIProvider,
	setCustomIconLoader,
	setCustomIconsLoader,
	appendCustomStyle,
	_api,
};
