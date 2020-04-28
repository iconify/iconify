// Core
import { IconifyJSON } from '@iconify/types';
import { merge } from '@iconify/core/lib/misc/merge';
import {
	stringToIcon,
	validateIcon,
	IconifyIconName,
} from '@iconify/core/lib/icon/name';
import { IconifyIcon, FullIconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconCustomisations,
	fullCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';
import {
	getStorage,
	getIcon,
	addIcon,
	addIconSet,
	listStoredPrefixes,
} from '@iconify/core/lib/storage';
import { iconToSVG, IconifyIconBuildResult } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { calcSize } from '@iconify/core/lib/builder/calc-size';

// Modules
import { coreModules } from '@iconify/core/lib/modules';
import { browserModules } from './modules';

// Finders
import { addFinder } from './finder';
import { finder as iconifyFinder } from './finders/iconify';
// import { finder as iconifyIconFinder } from './finders/iconify-icon';

// Cache
import { storeCache, loadCache, config } from '@iconify/core/lib/cache/storage';

// API
import { API } from '@iconify/core/lib/api/';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import { setAPIConfig, IconifyAPIConfig } from '@iconify/core/lib/api/config';
import { prepareQuery, sendQuery } from './modules/api-jsonp';

// Observer
import { observer } from './modules/observer';

// Scan
import { scanDOM } from './scan';

/**
 * Export required types
 */
// JSON stuff
export { IconifyIcon, IconifyJSON };

// Customisations
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
};

// Build
export { IconifyIconBuildResult };

// API
export { IconifyAPIConfig };

/**
 * Cache types
 */
export type IconifyCacheType = 'local' | 'session' | 'all';

/**
 * Iconify interface
 */
export interface IconifyGlobal {
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
	listIcons: (prefix?: string) => string[];

	/* Rendering icons */
	/**
	 * Get icon data
	 */
	renderIcon: (
		name: string,
		customisations: IconifyIconCustomisations
	) => IconifyIconBuildResult | null;

	/**
	 * Replace IDs in icon body, should be used when parsing renderIcon() result
	 */
	replaceIDs: (body: string) => string;

	/**
	 * Calculate width knowing height and width/height ratio (or vice versa)
	 */
	calculateSize: (
		size: IconifyIconSize,
		ratio: number,
		precision?: number
	) => IconifyIconSize;

	/* Add icons */
	/**
	 * Add icon to storage
	 */
	addIcon: (name: string, data: IconifyIcon) => boolean;

	/**
	 * Add icon set to storage
	 */
	addCollection: (data: IconifyJSON) => boolean;

	/* API stuff */
	/**
	 * Pause DOM observer
	 */
	pauseObserver: () => void;

	/**
	 * Resume DOM observer
	 */
	resumeObserver: () => void;

	/**
	 * Set API configuration
	 */
	setAPIConfig: (
		customConfig: Partial<IconifyAPIConfig>,
		prefix?: string | string[]
	) => void;

	/* Scan DOM */
	/**
	 * Scan DOM
	 */
	scanDOM: (root?: HTMLElement) => void;

	/**
	 * Set root node
	 */
	setRoot: (root: HTMLElement) => void;

	/**
	 * Toggle local and session storage
	 */
	enableCache: (storage: IconifyCacheType, value: boolean) => void;
}

/**
 * Get icon name
 */
function getIconName(name: string): IconifyIconName | null {
	const icon = stringToIcon(name);
	if (!validateIcon(icon)) {
		return null;
	}
	return icon;
}

/**
 * Get icon data
 */
function getIconData(name: string): FullIconifyIcon | null {
	const icon = getIconName(name);
	return icon ? getIcon(getStorage(icon.prefix), icon.name) : null;
}

/**
 * Get SVG data
 */
function getSVG(
	name: string,
	customisations: IconifyIconCustomisations
): IconifyIconBuildResult | null {
	// Get icon data
	const iconData = getIconData(name);
	if (!iconData) {
		return null;
	}

	// Clean up customisations
	const changes = fullCustomisations(customisations);

	// Get data
	return iconToSVG(iconData, changes);
}

/**
 * Global variable
 */
const Iconify: IconifyGlobal = {
	// Version
	getVersion: () => '__iconify_version__',

	// Check if icon exists
	iconExists: (name) => getIconData(name) !== void 0,

	// Get raw icon data
	getIcon: (name) => {
		const result = getIconData(name);
		return result ? merge(result) : null;
	},

	// List icons
	listIcons: (prefix?: string) => {
		let icons = [];

		let prefixes = listStoredPrefixes();
		let addPrefix = true;
		if (typeof prefix === 'string') {
			prefixes = prefixes.indexOf(prefix) !== -1 ? [] : [prefix];
			addPrefix = false;
		}

		prefixes.forEach((prefix) => {
			const storage = getStorage(prefix);
			let icons = Object.keys(storage.icons);
			if (addPrefix) {
				icons = icons.map((name) => prefix + ':' + name);
			}
			icons = icons.concat(icons);
		});

		return icons;
	},

	// Render icon
	renderIcon: getSVG,

	// Replace IDs in body
	replaceIDs: replaceIDs,

	// Calculate size
	calculateSize: calcSize,

	// Add icon
	addIcon: (name, data) => {
		const icon = getIconName(name);
		if (!icon) {
			return false;
		}
		const storage = getStorage(icon.prefix);
		return addIcon(storage, icon.name, data);
	},

	// Add icon set
	addCollection: (data) => {
		if (
			typeof data !== 'object' ||
			typeof data.prefix !== 'string' ||
			!validateIcon({
				prefix: data.prefix,
				name: 'a',
			})
		) {
			return false;
		}

		const storage = getStorage(data.prefix);
		return !!addIconSet(storage, data);
	},

	// Pause observer
	pauseObserver: observer.pause,

	// Resume observer
	resumeObserver: observer.resume,

	// API configuration
	setAPIConfig: setAPIConfig,

	// Scan DOM
	scanDOM: scanDOM,

	// Set root node
	setRoot: (root: HTMLElement) => {
		browserModules.root = root;

		// Restart observer
		observer.init(scanDOM);

		// Scan DOM on next tick
		setTimeout(scanDOM);
	},

	// Allow storage
	enableCache: (storage: IconifyCacheType, value: boolean) => {
		switch (storage) {
			case 'local':
			case 'session':
				config[storage] = value;
				break;

			case 'all':
				for (const key in config) {
					config[key] = value;
				}
				break;
		}
	},
};

/**
 * Initialise stuff
 */
// Add finder modules
// addFinder(iconifyIconFinder);
addFinder(iconifyFinder);

// Set cache and load existing cache
coreModules.cache = storeCache;
loadCache();

// Set API
setAPIModule({
	send: sendQuery,
	prepare: prepareQuery,
});
coreModules.api = API;

// Load observer
browserModules.observer = observer;
setTimeout(() => {
	// Init on next tick when entire document has been parsed
	observer.init(scanDOM);
});

export default Iconify;
