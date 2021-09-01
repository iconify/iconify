import { API } from '.';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconLoaderAbort,
	IconifyIconLoaderCallback,
} from '../interfaces/loader';
import type { GetAPIConfig, IconifyAPIConfig } from './config';
import { getAPIConfig, setAPIConfig } from './config';
import type {
	IconifyAPIModule,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
} from './modules';
import { setAPIModule, getAPIModule } from './modules';
import type { MergeParams, IconifyAPIMergeQueryParams } from './params';
import { mergeParams } from './params';

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
	loadIcons: API.loadIcons,
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
	 * Set API module
	 */
	setAPIModule: (provider: string, item: IconifyAPIModule) => void;

	/**
	 * Get API module
	 */
	getAPIModule: (provider: string) => IconifyAPIModule | undefined;

	/**
	 * Optional setFetch and getFetch (should be imported from ./modules/fetch if fetch is used)
	 */
	setFetch?: (item: typeof fetch) => void;
	getFetch?: () => typeof fetch | null;

	/**
	 * Merge parameters
	 */
	mergeParams: MergeParams;
}

export const APIInternalFunctions: IconifyAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	getAPIModule,
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
