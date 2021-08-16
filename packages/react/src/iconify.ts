import React from 'react';
import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import { IconifyIconName, stringToIcon } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
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
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { fullIcon } from '@iconify/utils/lib/icon';

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
	IconifyIconOnLoad,
	IconifyIconCustomisations,
	IconifyIconProps,
	IconProps,
	IconRef,
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
 * Component
 */
interface InternalIconProps extends IconProps {
	_ref?: IconRef;
	_inline: boolean;
}

interface IconComponentData {
	data: Required<IconifyIcon>;
	classes?: string[];
}

interface IconComponentState {
	icon: IconComponentData | null;
}

interface ComponentAbortData {
	name: string;
	abort: IconifyIconLoaderAbort;
}

class IconComponent extends React.Component<
	InternalIconProps,
	IconComponentState
> {
	protected _icon: string;
	protected _loading: ComponentAbortData | null;

	constructor(props: InternalIconProps) {
		super(props);
		this.state = {
			// Render placeholder before component is mounted
			icon: null,
		};
	}

	/**
	 * Abort loading icon
	 */
	_abortLoading() {
		if (this._loading) {
			this._loading.abort();
			this._loading = null;
		}
	}

	/**
	 * Update state
	 */
	_setData(icon: IconComponentData | null) {
		if (this.state.icon !== icon) {
			this.setState({
				icon,
			});
		}
	}

	/**
	 * Check if icon should be loaded
	 */
	_checkIcon(changed: boolean) {
		const state = this.state;
		const icon = this.props.icon;

		// Icon is an object
		if (
			typeof icon === 'object' &&
			icon !== null &&
			typeof icon.body === 'string'
		) {
			// Stop loading
			this._icon = '';
			this._abortLoading();

			if (changed || state.icon === null) {
				// Set data if it was changed
				this._setData({
					data: fullIcon(icon),
				});
			}
			return;
		}

		// Invalid icon?
		let iconName: IconifyIconName | null;
		if (
			typeof icon !== 'string' ||
			(iconName = stringToIcon(icon, false, true)) === null
		) {
			this._abortLoading();
			this._setData(null);
			return;
		}

		// Load icon
		const data = getIconData(iconName);
		if (data === null) {
			// Icon needs to be loaded
			if (!this._loading || this._loading.name !== icon) {
				// New icon to load
				this._abortLoading();
				this._icon = '';
				this._setData(null);
				this._loading = {
					name: icon,
					abort: API.loadIcons(
						[iconName],
						this._checkIcon.bind(this, false)
					),
				};
			}
			return;
		}

		// Icon data is available
		if (this._icon !== icon || state.icon === null) {
			// New icon or icon has been loaded
			this._abortLoading();
			this._icon = icon;

			// Add classes
			const classes: string[] = ['iconify'];
			if (iconName.prefix !== '') {
				classes.push('iconify--' + iconName.prefix);
			}
			if (iconName.provider !== '') {
				classes.push('iconify--' + iconName.provider);
			}

			// Set data
			this._setData({
				data,
				classes,
			});
			if (this.props.onLoad) {
				this.props.onLoad(icon);
			}
		}
	}

	/**
	 * Component mounted
	 */
	componentDidMount() {
		this._checkIcon(false);
	}

	/**
	 * Component updated
	 */
	componentDidUpdate(oldProps) {
		if (oldProps.icon !== this.props.icon) {
			this._checkIcon(true);
		}
	}

	/**
	 * Abort loading
	 */
	componentWillUnmount() {
		this._abortLoading();
	}

	/**
	 * Render
	 */
	render() {
		const props = this.props;
		const icon = this.state.icon;

		if (icon === null) {
			// Render placeholder
			return props.children
				? (props.children as JSX.Element)
				: React.createElement('span', {});
		}

		// Add classes
		let newProps = props;
		if (icon.classes) {
			newProps = {
				...props,
				className:
					(typeof props.className === 'string'
						? props.className + ' '
						: '') + icon.classes.join(' '),
			};
		}

		// Render icon
		return render(icon.data, newProps, props._inline, props._ref);
	}
}

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = React.forwardRef<IconRef, IconProps>(function Icon(
	props,
	ref
) {
	const newProps = {
		...props,
		_ref: ref,
		_inline: false,
	};
	return React.createElement(IconComponent, newProps);
});

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = React.forwardRef<IconRef, IconProps>(
	function InlineIcon(props, ref) {
		const newProps = { ...props, _ref: ref, _inline: true };
		return React.createElement(IconComponent, newProps);
	}
);
