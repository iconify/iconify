import { IconifyJSON } from '@iconify/types';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { IconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/interfaces/loader';
import { IconifyAPIConfig } from '@iconify/core/lib/api/config';

/**
 * Iconify interface
 */
export interface IconifyAPI {
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
