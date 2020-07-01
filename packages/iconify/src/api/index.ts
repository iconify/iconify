import { IconifyIconName } from '@iconify/core/lib/icon/name';
import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';
import { IconifyAPIConfig, GetAPIConfig } from '@iconify/core/lib/api/config';
import { IconifyAPIInternalStorage } from '@iconify/core/lib/api/';
import { IconifyAPIModule } from '@iconify/core/lib/api/modules';

/**
 * Cache types
 */
export type IconifyCacheType = 'local' | 'session' | 'all';

/**
 * Iconify interface
 */
export interface IconifyAPI {
	/* Scan DOM */
	/**
	 * Toggle local and session storage
	 */
	enableCache: (storage: IconifyCacheType, value: boolean) => void;

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
	) => void;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyExposedAPIInternals {
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
