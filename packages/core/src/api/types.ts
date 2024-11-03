import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from './icons';
import type { SortedIcons } from '../icon/sort';
import type { IconStorage } from '../storage/storage';
import { IconifyIcon, IconifyJSON } from '@iconify/types';

/**
 * Custom icons loader
 */
export type IconifyCustomIconsLoader = (
	icons: string[],
	prefix: string,
	provider: string
) => Promise<IconifyJSON | null> | IconifyJSON | null;

/**
 * Custom loader for one icon
 */
export type IconifyCustomIconLoader = (
	name: string,
	prefix: string,
	provider: string
) => Promise<IconifyIcon | null> | IconifyIcon | null;

/**
 * Storage for callbacks
 */
export interface APICallbackItem {
	// id
	id: number;

	// Icons
	icons: SortedIcons;

	// Callback to call on any update
	callback: IconifyIconLoaderCallback;

	// Callback to call to remove item from queue
	abort: IconifyIconLoaderAbort;
}

/**
 * Add custom stuff to storage
 */
export interface IconStorageWithAPI extends IconStorage {
	/**
	 * Custom loaders
	 *
	 * If custom loader is set, API module will not be used to load icons.
	 *
	 * You can set only one of these loaders.
	 *
	 * If both loaders are set, loader for one icon will be used when requesting only once icon,
	 * loader for multiple icons will be used when requesting multiple icons.
	 */
	loadIcons?: IconifyCustomIconsLoader;
	loadIcon?: IconifyCustomIconLoader;

	/**
	 * List of icons that are being loaded, added to storage
	 *
	 * Icons are added to this list when they are being checked and
	 * removed from this list when they are added to storage as
	 * either an icon or a missing icon. This way same icon should
	 * never be requested twice.
	 */
	pendingIcons?: Set<string>;

	/**
	 * List of icons that are waiting to be loaded.
	 *
	 * List is passed to API module, then cleared.
	 *
	 * This list should not be used for any checks, use pendingIcons to check
	 * if icons is being loaded.
	 *
	 * [provider][prefix] = array of icon names
	 */
	iconsToLoad?: string[];

	// Flags to merge multiple synchronous icon requests in one asynchronous request
	iconsLoaderFlag?: boolean;
	iconsQueueFlag?: boolean;

	// Loader callbacks
	loaderCallbacks?: APICallbackItem[];

	// Pending callbacks update
	pendingCallbacksFlag?: boolean;
}
