import { defineComponent } from 'vue';
import type {
	DefineComponent,
	ComponentOptionsMixin,
	EmitsOptions,
	VNodeProps,
	AllowedComponentProps,
	ComponentCustomProps,
} from 'vue';

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
	IconifyIconOnLoad,
	IconProps,
	IconifyIconCustomisations,
	IconifyIconProps,
	IconifyRenderMode,
	IconifyIconCustomiseCallback,
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
	IconifyRenderMode,
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
 * Empty icon data, rendered when icon is not available
 */
const emptyIcon = {
	...defaultIconProps,
	body: '',
};

/**
 * Component
 */
interface IconComponentData {
	data: IconifyIcon;
	classes?: string[];
}

export const Icon = defineComponent<IconProps>({
	// Do not inherit other attributes: it is handled by render()
	inheritAttrs: false,

	// Set initial data
	data() {
		return {
			// Current icon name
			_name: '',

			// Loading
			_loadingIcon: null,

			// Mounted status
			iconMounted: false,

			// Callback counter to trigger re-render
			counter: 0,
		};
	},

	mounted() {
		// Mark as mounted
		this.iconMounted = true;
	},

	unmounted() {
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
			onload?: IconifyIconOnLoad,
			customise?: IconifyIconCustomiseCallback
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
					data: icon,
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
			let data = getIconData(iconName);
			if (!data) {
				// Icon data is not available
				if (!this._loadingIcon || this._loadingIcon.name !== icon) {
					// New icon to load
					this.abortLoading();
					this._name = '';
					if (data !== null) {
						// Icon was not loaded
						this._loadingIcon = {
							name: icon,
							abort: loadIcons([iconName], () => {
								this.counter++;
							}),
						};
					}
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

			// Customise icon
			if (customise) {
				// Clone data and customise it
				data = Object.assign({}, data);
				const customised = customise(
					data.body,
					iconName.name,
					iconName.prefix,
					iconName.provider
				);
				if (typeof customised === 'string') {
					data.body = customised;
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
	render() {
		// Re-render when counter changes
		this.counter;

		const props = this.$attrs;

		// Get icon data
		const icon: IconComponentData | null =
			this.iconMounted || props.ssr
				? this.getIcon(props.icon, props.onLoad, props.customise)
				: null;

		// Validate icon object
		if (!icon) {
			return render(emptyIcon, props);
		}

		// Add classes
		let newProps = props;
		if (icon.classes) {
			newProps = {
				...props,
				class:
					(typeof props['class'] === 'string'
						? props['class'] + ' '
						: '') + icon.classes.join(' '),
			};
		}

		// Render icon
		return render(
			{
				...defaultIconProps,
				...icon.data,
			},
			newProps
		);
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
