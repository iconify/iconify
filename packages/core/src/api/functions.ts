import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { sendAPIQuery } from './query';
import { loadIcons } from './icons';
import type {
	IconifyIconLoaderAbort,
	IconifyIconLoaderCallback,
} from './icons';
import type {
	GetAPIConfig,
	IconifyAPIConfig,
	PartialIconifyAPIConfig,
} from './config';
import { getAPIConfig, setAPIConfig, listAPIProviders } from './config';
import type {
	IconifyAPIModule,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
} from './modules';
import { setAPIModule } from './modules';
import type { MergeParams, IconifyAPIMergeQueryParams } from './params';
import { mergeParams } from './params';
import type {
	QueryAbortCallback,
	QueryDoneCallback,
} from '@cyberalien/redundancy';

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
	 * Add API provider
	 */
	addAPIProvider: (
		provider: string,
		customConfig: Partial<IconifyAPIConfig>
	) => boolean;
}

export const APIFunctions: IconifyAPIFunctions = {
	loadIcons,
	addAPIProvider: setAPIConfig,
};

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
	 * Optional setFetch and getFetch (should be imported from ./modules/fetch if fetch is used)
	 */
	setFetch?: (item: typeof fetch) => void;
	getFetch?: () => typeof fetch | null;

	/**
	 * List all API providers (from config)
	 */
	listAPIProviders: () => string[];

	/**
	 * Merge parameters
	 */
	mergeParams: MergeParams;
}

export const APIInternalFunctions: IconifyAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	listAPIProviders,
	mergeParams,
};

/**
 * Types needed for internal functions
 */
export type {
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
	IconifyAPIMergeQueryParams,
};
