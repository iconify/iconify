import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconCustomisations,
} from '@iconify/utils/lib/customisations';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';

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
import type { IconifyIconAttributes } from './attributes/types';
import { IconifyIconComponent } from './component';

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
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
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
};

// Builder functions
export { IconifyIconBuildResult };

// Browser cache
export { IconifyBrowserCacheType };

// Component types
export { IconifyIconAttributes };

/**
 * Export component
 */
export { IconifyIconComponent };

/**
 * Export functions
 */
const {
	enableCache,
	disableCache,
	iconExists,
	getIcon,
	listIcons,
	shareStorage,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	loadIcon,
	addAPIProvider,
	_api,
} = IconifyIconComponent;

export {
	enableCache,
	disableCache,
	iconExists,
	getIcon,
	listIcons,
	shareStorage,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	loadIcon,
	addAPIProvider,
	_api,
};
