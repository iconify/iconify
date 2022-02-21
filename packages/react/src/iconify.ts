import React from 'react';
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
					abort: loadIcons(
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
	mergeParams,
};

/**
 * Export functions
 */
// IconifyAPIInternalFunctions
export { _api };

// IconifyAPIFunctions
export { addAPIProvider, loadIcons, loadIcon };

// IconifyStorageFunctions
export { iconExists, getIcon, listIcons, addIcon, addCollection, shareStorage };

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconifyBrowserCacheFunctions
export { enableCache, disableCache };
