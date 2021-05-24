import React from 'react';
import { IconifyJSON } from '@iconify/types';

// Parent component
import {
	IconProps,
	Icon as ReactIcon,
	InlineIcon as ReactInlineIcon,
} from '@iconify/react/lib/icon';

// Core
import { IconifyIconName, stringToIcon } from '@iconify/utils/lib/icon/name';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
import {
	IconifyStorageFunctions,
	storageFunctions,
	getIconData,
} from '@iconify/core/lib/storage/functions';
import {
	IconifyBuilderFunctions,
	builderFunctions,
} from '@iconify/core/lib/builder/functions';
import { IconifyIcon } from '@iconify/utils/lib/icon';

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
import { getAPIModule as getFetchAPIModule } from '@iconify/core/lib/api/modules/fetch';
import {
	setAPIConfig,
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	getAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';

// Cache
import { storeCache, loadCache } from '@iconify/core/lib/browser-storage';
import {
	IconifyBrowserCacheType,
	IconifyBrowserCacheFunctions,
	toggleBrowserCache,
} from '@iconify/core/lib/browser-storage/functions';

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
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
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
};

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
 * Stateful component
 */
type IconPropsWithoutIcon = Pick<IconProps, Exclude<keyof IconProps, 'icon'>>;
interface StatefulProps extends IconPropsWithoutIcon {
	icon: IconifyIconName;
	func: typeof ReactIcon;
}

interface StatefulState {
	loaded: boolean;
	data: IconifyIcon | null;
}

/**
 * Dynamic component
 */
class DynamicComponent extends React.Component<StatefulProps, StatefulState> {
	protected _abort: IconifyIconLoaderAbort | null;

	/**
	 * Set initial state
	 */
	constructor(props: StatefulProps) {
		super(props);

		this.state = {
			loaded: false,
			data: null,
		};
	}

	/**
	 * Load icon data on mount
	 */
	componentDidMount() {
		if (!this._loaded()) {
			API.loadIcons([this.props.icon], this._loaded.bind(this));
		}
	}

	/**
	 * Render
	 */
	render() {
		const state = this.state;
		if (!state.loaded) {
			// Empty
			return React.createElement('span');
		}

		// Replace icon in props with object
		const props = this.props;
		let newProps: IconProps = {} as IconProps;
		Object.assign(newProps, props, {
			icon: state.data,
		});
		delete newProps['func'];
		delete newProps.ref;

		return React.createElement(this.props.func, newProps);
	}

	/**
	 * Loaded
	 */
	_loaded(): boolean {
		if (!this.state.loaded) {
			const data = getIconData(this.props.icon);
			if (data) {
				this._abort = null;
				this.setState({
					loaded: true,
					data,
				});
				return true;
			}
			return false;
		}
		return true;
	}

	/**
	 * Abort loading
	 */
	componentWillUnmount() {
		if (this._abort) {
			this._abort();
		}
	}
}

/**
 * Render icon
 */
const component = (props: IconProps, func: typeof ReactIcon): JSX.Element => {
	let iconData: IconifyIcon;

	// Get icon data
	if (typeof props.icon === 'string') {
		const iconName = stringToIcon(props.icon, true);
		if (!iconName) {
			return React.createElement('span');
		}

		iconData = getIconData(iconName);

		if (iconData) {
			let staticProps: IconProps = {} as IconProps;
			Object.assign(staticProps, props);
			staticProps.icon = iconData;
			return React.createElement(func, staticProps);
		}

		// Return dynamic component
		const dynamicProps: StatefulProps = {} as StatefulProps;
		Object.assign(dynamicProps, props, {
			icon: iconName,
			func,
		});
		return React.createElement(DynamicComponent, dynamicProps);
	} else {
		// Passed icon data as object: render @iconify/react component
		return React.createElement(func, props);
	}
};

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = (props: IconProps) => component(props, ReactIcon);

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = (props: IconProps) =>
	component(props, ReactInlineIcon);

/**
 * Initialise stuff
 */
// Set API
coreModules.api = API;

let getAPIModule: GetIconifyAPIModule;
try {
	getAPIModule =
		typeof fetch === 'function' && typeof Promise === 'function'
			? getFetchAPIModule
			: getJSONPAPIModule;
} catch (err) {
	getAPIModule = getJSONPAPIModule;
}
setAPIModule('', getAPIModule(getAPIConfig));

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	coreModules.cache = storeCache;
	loadCache();

	const _window = window;

	// Load icons from global "IconifyPreload"
	interface WindowWithIconifyPreload {
		IconifyPreload: IconifyJSON[] | IconifyJSON;
	}
	if (
		(_window as unknown as WindowWithIconifyPreload).IconifyPreload !==
		void 0
	) {
		const preload = (_window as unknown as WindowWithIconifyPreload)
			.IconifyPreload;
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
	interface WindowWithIconifyProviders {
		IconifyProviders: Record<string, PartialIconifyAPIConfig>;
	}
	if (
		(_window as unknown as WindowWithIconifyProviders).IconifyProviders !==
		void 0
	) {
		const providers = (_window as unknown as WindowWithIconifyProviders)
			.IconifyProviders;
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
