import type {
	QueryAbortCallback,
	QueryDoneCallback,
} from '@iconify/api-redundancy';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconLoaderAbort,
	IconifyIconLoaderCallback,
} from './icons';
import type { GetAPIConfig, PartialIconifyAPIConfig } from './config';
import type {
	IconifyAPIModule,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
} from './modules';
import type { IconifyIcon } from '@iconify/types';
import type {
	IconifyCustomIconLoader,
	IconifyCustomIconsLoader,
} from './types';

/**
 * Iconify API functions
 */
export interface IconifyAPIFunctions {
	/**
	 * Load icons
	 */
	loadIcons: (
		icons: (IconifyIconName | string)[],
		callback?: IconifyIconLoaderCallback
	) => IconifyIconLoaderAbort;

	/**
	 * Load one icon, using Promise syntax
	 */
	loadIcon: (
		icon: IconifyIconName | string
	) => Promise<Required<IconifyIcon>>;

	/**
	 * Add API provider
	 */
	addAPIProvider: (
		provider: string,
		customConfig: PartialIconifyAPIConfig
	) => boolean;

	/**
	 * Set custom loader for multple icons
	 */
	setCustomIconsLoader: (
		callback: IconifyCustomIconsLoader,
		prefix: string,
		provider?: string
	) => void;

	/**
	 * Set custom loader for one icon
	 */
	setCustomIconLoader: (
		callback: IconifyCustomIconLoader,
		prefix: string,
		provider?: string
	) => void;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyAPIInternalFunctions {
	/**
	 * Get API config, used by custom modules
	 */
	getAPIConfig: GetAPIConfig;

	/**
	 * Set custom API module
	 */
	setAPIModule: (provider: string, item: IconifyAPIModule) => void;

	/**
	 * Send API query
	 */
	sendAPIQuery: (
		target: string | PartialIconifyAPIConfig,
		query: IconifyAPIQueryParams,
		callback: QueryDoneCallback
	) => QueryAbortCallback;

	/**
	 * Set and get fetch()
	 */
	setFetch: (item: typeof fetch) => void;
	getFetch: () => typeof fetch | undefined;

	/**
	 * List all API providers (from config)
	 */
	listAPIProviders: () => string[];
}

/**
 * Types needed for internal functions
 */
export type { IconifyAPIQueryParams, IconifyAPICustomQueryParams };
