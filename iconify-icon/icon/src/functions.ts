import type { IconifyJSON } from '@iconify/types';

// Core
import {
	allowSimpleNames,
	IconifyStorageFunctions,
} from '@iconify/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconify/utils/lib/svg/build';
import { calculateSize } from '@iconify/utils/lib/svg/size';

// Custom additions used for building icons that are used by component
// Can be reused for building icons in SSR and assigning it as content of component
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';

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
import {
	setCustomIconLoader,
	setCustomIconsLoader,
} from '@iconify/core/lib/api/loaders';

// Cache
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';
import { appendCustomStyle } from './render/style';

/**
 * Interface for exported functions
 */
export interface IconifyExportedFunctions
	extends IconifyStorageFunctions,
		IconifyBuilderFunctions,
		IconifyBrowserCacheFunctions,
		IconifyAPIFunctions {
	// API internal functions
	_api: IconifyAPIInternalFunctions;

	// Append custom style to all components
	appendCustomStyle: (value: string) => void;

	// Render HTML
	iconToHTML: (body: string, attributes: Record<string, string>) => string;
	svgToURL: (svg: string) => string;
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		//
	}
	if (_window) {
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
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		enableCache: (storage: IconifyBrowserCacheType) => {
			// No longer used
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		disableCache: (storage: IconifyBrowserCacheType) => {
			// No longer used
		},
		iconLoaded,
		iconExists: iconLoaded, // deprecated, kept to avoid breaking changes
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
}
