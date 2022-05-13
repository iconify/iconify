import React from 'react';
import type { IconifyIcon, IconifyIconAttributes } from 'iconify-icon';

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
} from 'iconify-icon';

// Builder functions
export type { IconifyIconBuildResult } from 'iconify-icon';

// Browser cache
export type { IconifyBrowserCacheType } from 'iconify-icon';

// Component types
export type { IconifyIconAttributes, IconifyRenderMode } from 'iconify-icon';

/**
 * Export functions
 */
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
} from 'iconify-icon';

/**
 * Properties for React component
 */
export interface IconifyIconProps
	extends React.HTMLProps<HTMLElement>,
		IconifyIconAttributes {
	icon: string | IconifyIcon;
	inline?: boolean;
}

/**
 * React component
 */
export function Icon(props: IconifyIconProps) {
	const newProps = {
		...props,
	};

	// Stringify icon
	if (typeof props.icon === 'object') {
		newProps.icon = JSON.stringify(props.icon);
	}

	// Boolean
	if (!props.inline) {
		delete newProps.inline;
	}

	return React.createElement('iconify-icon', newProps);
}
