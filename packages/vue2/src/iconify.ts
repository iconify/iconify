import Vue from 'vue';
import type { CreateElement, VNode } from 'vue';
import type { ExtendedVue } from 'vue/types/vue';
import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import {
	iconExists,
	getIcon,
	addIcon,
	addCollection,
	getIconData,
	allowSimpleNames,
} from '@iconify/core/lib/storage/functions';
import { listIcons, shareStorage } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { buildIcon } from '@iconify/core/lib/builder/functions';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { fullIcon } from '@iconify/utils/lib/icon';

// API
import type {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
	IconifyAPIMergeQueryParams,
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
import { fetchAPIModule, setFetch } from '@iconify/core/lib/api/modules/fetch';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/api/icons';
import { loadIcons } from '@iconify/core/lib/api/icons';
import { sendAPIQuery } from '@iconify/core/lib/api/query';
import { mergeParams } from '@iconify/core/lib/api/params';

// Cache
import { cache } from '@iconify/core/lib/cache';
import { storeCache, loadCache } from '@iconify/core/lib/browser-storage';
import { toggleBrowserCache } from '@iconify/core/lib/browser-storage/functions';
import type {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
} from '@iconify/core/lib/browser-storage/functions';

// Properties
import type {
	RawIconCustomisations,
	IconifyIconOnLoad,
	IconProps,
	IconifyIconCustomisations,
	IconifyIconProps,
} from './props';

// Render SVG
import { render } from './render';

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

// Customisations and icon props
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconProps,
	IconProps,
	IconifyIconOnLoad,
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
	IconifyAPIMergeQueryParams,
};

// Builder functions
export { RawIconCustomisations, IconifyIconBuildResult };

/* Browser cache */
export { IconifyBrowserCacheType };

/**
 * Enable cache
 */
function enableCache(storage: IconifyBrowserCacheType): void {
	toggleBrowserCache(storage, true);
}

/**
 * Disable cache
 */
function disableCache(storage: IconifyBrowserCacheType): void {
	toggleBrowserCache(storage, false);
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
	// Set cache and load existing cache
	cache.store = storeCache;
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
 * Component
 */
interface IconComponentData {
	data: Required<IconifyIcon>;
	classes?: string[];
}

export const Icon = Vue.extend({
	// Do not inherit other attributes: it is handled by render()
	// In Vue 2 style is still passed!
	inheritAttrs: false,

	// Set initial data
	data() {
		return {
			// Mounted status
			mounted: false,
		};
	},

	beforeMount() {
		// Current icon name
		this._name = '';

		// Loading
		this._loadingIcon = null;

		// Mark as mounted
		this.mounted = true;
	},

	beforeDestroy() {
		this.abortLoading();
	},

	methods: {
		abortLoading() {
			if (this._loadingIcon) {
				this._loadingIcon.abort();
				this._loadingIcon = null;
			}
		},
		// Get data for icon to render or null
		getIcon(
			icon: IconifyIcon | string,
			onload?: IconifyIconOnLoad
		): IconComponentData | null {
			// Icon is an object
			if (
				typeof icon === 'object' &&
				icon !== null &&
				typeof icon.body === 'string'
			) {
				// Stop loading
				this._name = '';
				this.abortLoading();
				return {
					data: fullIcon(icon),
				};
			}

			// Invalid icon?
			let iconName: IconifyIconName | null;
			if (
				typeof icon !== 'string' ||
				(iconName = stringToIcon(icon, false, true)) === null
			) {
				this.abortLoading();
				return null;
			}

			// Load icon
			const data = getIconData(iconName);
			if (data === null) {
				// Icon needs to be loaded
				if (!this._loadingIcon || this._loadingIcon.name !== icon) {
					// New icon to load
					this.abortLoading();
					this._name = '';
					this._loadingIcon = {
						name: icon,
						abort: loadIcons([iconName], () => {
							this.$forceUpdate();
						}),
					};
				}
				return null;
			}

			// Icon data is available
			this.abortLoading();
			if (this._name !== icon) {
				this._name = icon;
				if (onload) {
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
		},
	},

	// Render icon
	render(createElement: CreateElement): VNode {
		function placeholder(slots): VNode {
			// Render child nodes
			if (slots.default) {
				const result = slots.default;
				if (result instanceof Array && result.length > 0) {
					// If there are multiple child nodes, they must be wrapped in Vue 2
					return result.length === 1
						? result[0]
						: createElement('span', result);
				}
			}
			return null as unknown as VNode;
		}
		if (!this.mounted) {
			return placeholder(this.$slots);
		}

		// Get icon data
		const props = this.$attrs;
		const icon: IconComponentData | null = this.getIcon(
			props.icon,
			props.onLoad
		);

		// Validate icon object
		if (!icon) {
			// Render child nodes
			return placeholder(this.$slots);
		}

		// Add classes
		let context = this.$data;
		if (icon.classes) {
			context = {
				...context,
				class:
					(typeof context['class'] === 'string'
						? context['class'] + ' '
						: '') + icon.classes.join(' '),
			};
		}

		// Render icon
		return render(createElement, props, context, icon.data);
	},
});

/**
 * Internal API
 */
const _api: IconifyAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	setFetch,
	listAPIProviders,
	mergeParams,
};

/**
 * Export functions
 */
// IconifyAPIInternalFunctions
export { _api };

// IconifyAPIFunctions
export { addAPIProvider, loadIcons };

// IconifyStorageFunctions
export { iconExists, getIcon, listIcons, addIcon, addCollection, shareStorage };

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconifyBrowserCacheFunctions
export { enableCache, disableCache };
