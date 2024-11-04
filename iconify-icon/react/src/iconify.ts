import React from 'react';
import 'iconify-icon';

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
 * Properties for React component
 */
export interface IconifyIconProps
	extends React.HTMLProps<HTMLElement>,
		IconifyIconProperties {
	// Rotation can be string or number
	rotate?: string | number;
}

/**
 * React component
 */
export const Icon = React.forwardRef(
	(
		props: IconifyIconProps,
		ref: React.ForwardedRef<IconifyIconHTMLElement>
	) => {
		const newProps: Record<string, unknown> = {
			...props,
			ref,
		};

		// Stringify icon
		if (typeof props.icon === 'object') {
			newProps.icon = JSON.stringify(props.icon);
		}

		// Boolean
		if (!props.inline) {
			delete newProps.inline;
		}

		// React cannot handle className for web components
		if (props.className) {
			newProps['class'] = props.className;
		}

		return React.createElement('iconify-icon', newProps);
	}
);
