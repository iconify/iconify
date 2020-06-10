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
	/* Getting icons */
	/**
	 * Check if icon exists
	 */
	iconExists: (name: string) => boolean;

	/**
	 * Get icon data with all properties
	 */
	getIcon: (name: string) => IconifyIcon | null;

	/**
	 * List all available icons
	 */
	listIcons: (provider?: string, prefix?: string) => string[];

	/**
	 * Load icons
	 */
	loadIcons: (
		icons: (IconifyIconName | string)[],
		callback?: IconifyIconLoaderCallback
	) => IconifyIconLoaderAbort;

	/* Add icons */
	/**
	 * Add icon to storage
	 */
	addIcon: (name: string, data: IconifyIcon) => boolean;

	/**
	 * Add icon set to storage
	 */
	addCollection: (data: IconifyJSON, provider?: string) => boolean;

	/* API stuff */
	/**
	 * Add API provider
	 */
	addAPIProvider: (
		provider: string,
		customConfig: Partial<IconifyAPIConfig>
	) => void;
}
