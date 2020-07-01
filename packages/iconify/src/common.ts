import { IconifyJSON } from '@iconify/types';
import { IconifyIcon } from '@iconify/core/lib/icon';

/**
 * Iconify interface
 */
export interface IconifyGlobalCommon {
	/* General section */
	/**
	 * Get version
	 */
	getVersion: () => string;

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

	/* Add icons */
	/**
	 * Add icon to storage
	 */
	addIcon: (name: string, data: IconifyIcon) => boolean;

	/**
	 * Add icon set to storage
	 */
	addCollection: (data: IconifyJSON, provider?: string) => boolean;
}
