import type { IconifyIcon, IconifyJSON } from '@iconify/types';

/**
 * Configuration for splitting queue into multiple queues
 */
export interface QueueSplitConfig {
	// Maximum length of combined names in queue
	maxLength?: number;

	// Maximum number of items in queue
	maxCount?: number;
}

/**
 * Loader for one icon
 */
export type IconLoader = (
	name: string,
	prefix: string,
	provider: string
) => Promise<IconifyIcon | null>;

interface ConfigWithIconLoader {
	loadIcon: IconLoader;
}

/**
 * Loader for multiple icons at once
 */
export type BulkIconLoader = (
	names: string[],
	prefix: string,
	provider: string
) => Promise<IconifyJSON | null>;

interface ConfigWithBulkIconLoader {
	loadIcons: BulkIconLoader;
}

/**
 * Loader: either for one icon or multiple icons
 */
type IconLoaderConfig = ConfigWithIconLoader | ConfigWithBulkIconLoader;

/**
 * Various properties
 */
interface ConfigProps extends QueueSplitConfig {
	// Validate icon names, allows only [0-9a-z-] characters
	validateNames?: boolean;

	// Allow reloading icons
	allowReload?: boolean;

	// Hosts for API, only used if loader is created using createIconifyAPILoader()
	hosts?: string[];
}

/**
 * Configuration for loader
 */
export type LoaderConfig = ConfigProps & IconLoaderConfig;
