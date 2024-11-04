import type { JSX } from 'solid-js';

import type {
	IconifyIcon,
	IconifyIconProperties,
	IconifyIconAttributes,
	IconifyIconHTMLElement,
} from 'iconify-icon';

/**
 * Export types
 */
export type {
	IconifyStorageFunctions,
	IconifyBuilderFunctions,
	IconifyBrowserCacheFunctions,
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
} from 'iconify-icon';

// JSON stuff
export type { IconifyIcon, IconifyJSON, IconifyIconName } from 'iconify-icon';

// Customisations
export type { IconifyIconCustomisations, IconifyIconSize } from 'iconify-icon';

// API
export type {
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
} from 'iconify-icon';

// Builder functions
export type { IconifyIconBuildResult } from 'iconify-icon';

// Browser cache
export type { IconifyBrowserCacheType } from 'iconify-icon';

// Component types
export type {
	IconifyIconAttributes,
	IconifyIconProperties,
	IconifyRenderMode,
	IconifyIconHTMLElement,
} from 'iconify-icon';

/**
 * Export functions
 */
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
	loadIcons,
	loadIcon,
	addAPIProvider,
	setCustomIconLoader,
	setCustomIconsLoader,
	appendCustomStyle,
	_api,
} from 'iconify-icon';

/**
 * Properties for Solid component
 */
type BaseElementProps = JSX.IntrinsicElements['span'];
export interface IconifyIconProps
	extends BaseElementProps,
		IconifyIconProperties {
	// Rotation can be string or number
	rotate?: string | number;
}

/**
 * Solid component
 */
export function Icon(props: IconifyIconProps): JSX.Element {
	let {
		icon,
		mode,
		inline,
		rotate,
		flip,
		width,
		height,
		preserveAspectRatio,
		noobserver,
	} = props;

	// Convert icon to string
	if (typeof icon === 'object') {
		icon = JSON.stringify(icon);
	}

	return (
		// @ts-ignore
		<iconify-icon
			attr:icon={icon}
			attr:mode={mode}
			attr:inline={inline}
			attr:rotate={rotate}
			attr:flip={flip}
			attr:width={width}
			attr:height={height}
			attr:preserveAspectRatio={preserveAspectRatio}
			attr:noobserver={noobserver}
			{...props}
		/>
	);
}
