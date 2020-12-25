import type { IconifyIconName } from '../icon/name';

/**
 * Function to abort loading (usually just removes callback because loading is already in progress)
 */
export type IconifyIconLoaderAbort = () => void;

/**
 * Loader callback
 *
 * Provides list of icons that have been loaded
 */
export type IconifyIconLoaderCallback = (
	loaded: IconifyIconName[],
	missing: IconifyIconName[],
	pending: IconifyIconName[],
	unsubscribe: IconifyIconLoaderAbort
) => void;

/**
 * Function to load icons
 */
export type IconifyLoadIcons = (
	icons: (IconifyIconName | string)[],
	callback?: IconifyIconLoaderCallback
) => IconifyIconLoaderAbort;
