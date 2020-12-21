import { createElement, Component } from 'react';
import { IconifyJSON } from '@iconify/types';

// Parent component
import {
	IconProps,
	Icon as ReactIcon,
	InlineIcon as ReactInlineIcon,
} from '@iconify/react/lib/icon';

// Core
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';
import {
	storageFunctions,
	getIconData,
	getIconName,
} from '@iconify/core/lib/storage/functions';
import { calcSize } from '@iconify/core/lib/builder/calc-size';
import { IconifyIcon } from '@iconify/core/lib/icon';

// Modules
import { coreModules } from '@iconify/core/lib/modules';

// API
import {
	API,
	getRedundancyCache,
	IconifyAPIInternalStorage,
} from '@iconify/core/lib/api/';
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
	IconifyLoadIcons,
} from '@iconify/core/lib/interfaces/loader';

// Cache
import {
	storeCache,
	loadCache,
	config,
} from '@iconify/core/lib/storage/browser';

/**
 * Export required types
 */
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

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyExposedInternals {
	/**
	 * Calculate width knowing height and width/height ratio (or vice versa)
	 */
	calculateSize: (
		size: IconifyIconSize,
		ratio: number,
		precision?: number
	) => IconifyIconSize;

	/**
	 * Get internal API data, used by Icon Finder
	 */
	getAPI: (provider: string) => IconifyAPIInternalStorage | undefined;

	/**
	 * Get API config, used by custom modules
	 */
	getAPIConfig: GetAPIConfig;

	/**
	 * Set API module
	 */
	setAPIModule: (provider: string, item: IconifyAPIModule) => void;
}

/**
 * Cache types
 */
export type IconifyCacheType = 'local' | 'session' | 'all';

/**
 * Toggle cache
 */
function toggleCache(storage: IconifyCacheType, value: boolean): void {
	switch (storage) {
		case 'local':
		case 'session':
			config[storage] = value;
			break;

		case 'all':
			for (const key in config) {
				config[key] = value;
			}
			break;
	}
}

export function enableCache(storage: IconifyCacheType): void {
	toggleCache(storage, true);
}

export function disableCache(storage: IconifyCacheType): void {
	toggleCache(storage, false);
}

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

/**
 * Load icons
 */
export const loadIcons: IconifyLoadIcons = API.loadIcons;

/**
 * Add API provider
 */
export { setAPIConfig as addAPIProvider };

/**
 * Export internal functions that can be used by third party implementations
 */
export const internals: IconifyExposedInternals = {
	// Calculate size
	calculateSize: calcSize,

	// Get API data
	getAPI: getRedundancyCache,

	// Get API config
	getAPIConfig,

	// Get API module
	setAPIModule,
};

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
class DynamicComponent extends Component<StatefulProps, StatefulState> {
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
			return null;
		}

		// Replace icon in props with object
		let newProps: IconProps = {} as IconProps;
		Object.assign(newProps, this.props, {
			icon: state.data,
		});
		delete newProps['func'];

		return this.props.func(newProps);
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
		const iconName = getIconName(props.icon);
		if (!iconName) {
			return null;
		}

		iconData = getIconData(iconName);

		if (iconData) {
			let staticProps: IconProps = {} as IconProps;
			Object.assign(staticProps, props);
			staticProps.icon = iconData;
			return func(staticProps);
		}

		// Return dynamic component
		const dynamicProps: StatefulProps = {} as StatefulProps;
		Object.assign(dynamicProps, props, {
			icon: iconName,
			func,
		});
		return createElement(DynamicComponent, dynamicProps);
	} else {
		return func(props);
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
		((_window as unknown) as WindowWithIconifyPreload).IconifyPreload !==
		void 0
	) {
		const preload = ((_window as unknown) as WindowWithIconifyPreload)
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
		((_window as unknown) as WindowWithIconifyProviders)
			.IconifyProviders !== void 0
	) {
		const providers = ((_window as unknown) as WindowWithIconifyProviders)
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
