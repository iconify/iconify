import type { IconifyAPIInternalStorage } from '.';
import { API, getRedundancyCache } from '.';
import type { IconifyIconName } from '../icon/name';
import type {
	IconifyIconLoaderAbort,
	IconifyIconLoaderCallback,
} from '../interfaces/loader';
import type { GetAPIConfig, IconifyAPIConfig } from './config';
import { getAPIConfig, setAPIConfig } from './config';
import type { IconifyAPIModule } from './modules';
import { setAPIModule } from './modules';

/**
 * Iconify API functions
 */
export interface IconifyAPIFunctions {
	/* Scan DOM */
	/**
	 * Load icons
	 */
	loadIcons: (
		icons: (IconifyIconName | string)[],
		callback?: IconifyIconLoaderCallback
	) => IconifyIconLoaderAbort;

	/* API stuff */
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

export const APIInternalFunctions: IconifyAPIInternalFunctions = {
	getAPI: getRedundancyCache,
	getAPIConfig,
	setAPIModule,
};
