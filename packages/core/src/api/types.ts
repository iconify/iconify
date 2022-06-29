import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from './icons';
import type { SortedIcons } from '../icon/sort';
import type { IconStorage } from '../storage/storage';

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
export interface IconStorageWithIcons extends IconStorage {
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
