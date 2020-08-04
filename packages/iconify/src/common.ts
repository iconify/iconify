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
} from '@iconify/core/lib/customisations';
import {
	getStorage,
	getIcon,
	addIcon,
	addIconSet,
	listStoredProviders,
	listStoredPrefixes,
} from '@iconify/core/lib/storage';
import { iconToSVG, IconifyIconBuildResult } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { renderIcon } from './modules/render';
import {
	initObserver,
	pauseObserver,
	resumeObserver,
	observeNode,
	removeObservedNode,
} from './modules/observer';
import { scanDOM, scanElement } from './modules/scanner';

// Finders
import { addFinder } from './modules/finder';
import { finder as iconifyFinder } from './finders/iconify';
import { findRootNode, addRootNode, addBodyNode } from './modules/root';
import { onReady } from './modules/ready';
// import { finder as iconifyIconFinder } from './finders/iconify-icon';

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
	return icon
		? getIcon(getStorage(icon.provider, icon.prefix), icon.name)
		: null;
}

/**
 * Get SVG data
 */
function buildIcon(
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
 * Generate icon
 */
function generateIcon(
	name: string,
	customisations: IconifyIconCustomisations,
	returnString: boolean
): SVGElement | string | null {
	// Get icon data
	const iconData = getIconData(name);
	if (!iconData) {
		return null;
	}

	// Split name
	const iconName = stringToIcon(name);

	// Clean up customisations
	const changes = fullCustomisations(customisations);

	// Get data
	return (renderIcon(
		{
			name: iconName,
		},
		changes,
		iconData,
		returnString
	) as unknown) as SVGElement | string | null;
}

/**
 * Add icon set
 */
export function addCollection(data: IconifyJSON, provider?: string) {
	if (typeof provider !== 'string') {
		provider = typeof data.provider === 'string' ? data.provider : '';
	}

	if (
		typeof data !== 'object' ||
		typeof data.prefix !== 'string' ||
		!validateIcon({
			provider,
			prefix: data.prefix,
			name: 'a',
		})
	) {
		return false;
	}

	const storage = getStorage(provider, data.prefix);
	return !!addIconSet(storage, data);
}

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

	/**
	 * Render icons
	 */
	renderSVG: (
		name: string,
		customisations: IconifyIconCustomisations
	) => SVGElement | null;

	renderHTML: (
		name: string,
		customisations: IconifyIconCustomisations
	) => string | null;

	/**
	 * Get icon data
	 */
	renderIcon: typeof buildIcon;

	/**
	 * Replace IDs in icon body, should be used when parsing buildIcon() result
	 */
	replaceIDs: typeof replaceIDs;

	/* Scanner */
	/**
	 * Scan DOM
	 */
	scan: (root?: HTMLElement) => void;

	/**
	 * Add root node
	 */
	observe: (root: HTMLElement) => void;

	/**
	 * Remove root node
	 */
	stopObserving: (root: HTMLElement) => void;

	/* Observer */
	/**
	 * Pause observer
	 */
	pauseObserver: (root?: HTMLElement) => void;

	/**
	 * Resume observer
	 */
	resumeObserver: (root?: HTMLElement) => void;
}

/**
 * Global variable
 */
export const IconifyCommon: IconifyGlobal = {
	// Version
	getVersion: () => '__iconify_version__',

	// Check if icon exists
	iconExists: (name) => getIconData(name) !== null,

	// Get raw icon data
	getIcon: (name) => {
		const result = getIconData(name);
		return result ? merge(result) : null;
	},

	// List icons
	listIcons: (provider?: string, prefix?: string) => {
		let icons = [];

		// Get providers
		let providers: string[];
		if (typeof provider === 'string') {
			providers = [provider];
		} else {
			providers = listStoredProviders();
		}

		// Get all icons
		providers.forEach((provider) => {
			let prefixes: string[];

			if (typeof prefix === 'string') {
				prefixes = [prefix];
			} else {
				prefixes = listStoredPrefixes(provider);
			}

			prefixes.forEach((prefix) => {
				const storage = getStorage(provider, prefix);
				let icons = Object.keys(storage.icons).map(
					(name) =>
						(provider !== '' ? '@' + provider + ':' : '') +
						prefix +
						':' +
						name
				);
				icons = icons.concat(icons);
			});
		});

		return icons;
	},

	// Add icon
	addIcon: (name, data) => {
		const icon = getIconName(name);
		if (!icon) {
			return false;
		}
		const storage = getStorage(icon.provider, icon.prefix);
		return addIcon(storage, icon.name, data);
	},

	// Add icon set
	addCollection,

	// Render SVG
	renderSVG: (name: string, customisations: IconifyIconCustomisations) => {
		return generateIcon(name, customisations, false) as SVGElement | null;
	},

	renderHTML: (name: string, customisations: IconifyIconCustomisations) => {
		return generateIcon(name, customisations, true) as string | null;
	},

	// Get rendered icon as object that can be used to create SVG (use replaceIDs on body)
	renderIcon: buildIcon,

	// Replace IDs in body
	replaceIDs,

	// Scan DOM
	scan: (root?: HTMLElement) => {
		if (root) {
			scanElement(root);
		} else {
			scanDOM();
		}
	},

	// Add root node
	observe: (root: HTMLElement) => {
		observeNode(root);
	},

	// Remove root node
	stopObserving: (root: HTMLElement) => {
		removeObservedNode(root);
	},

	// Pause observer
	pauseObserver: (root?: HTMLElement) => {
		if (root) {
			const node = findRootNode(root);
			if (node) {
				pauseObserver(node);
			}
		} else {
			pauseObserver();
		}
	},

	// Resume observer
	resumeObserver: (root?: HTMLElement) => {
		if (root) {
			const node = findRootNode(root);
			if (node) {
				resumeObserver(node);
			}
		} else {
			resumeObserver();
		}
	},
};

/**
 * Initialise stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Add document.body node
	addBodyNode();

	// Add finder modules
	// addFinder(iconifyIconFinder);
	addFinder(iconifyFinder);

	const _window = window;

	// Load icons from global "IconifyPreload"
	interface WindowWithIconifyPreload {
		IconifyPreload: IconifyJSON[] | IconifyJSON;
	}
	if (
		((_window as unknown) as WindowWithIconifyPreload).IconifyPreload !==
		void 0
	) {
		const preload = ((_window as unknown) as WindowWithIconifyPreload)
			.IconifyPreload;
		const err = 'Invalid IconifyPreload syntax.';
		if (typeof preload === 'object' && preload !== null) {
			(preload instanceof Array ? preload : [preload]).forEach((item) => {
				try {
					if (
						// Check if item is an object and not null/array
						typeof item !== 'object' ||
						item === null ||
						item instanceof Array ||
						// Check for 'icons' and 'prefix'
						typeof item.icons !== 'object' ||
						typeof item.prefix !== 'string' ||
						// Add icon set
						!addCollection(item)
					) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			});
		}
	}

	// Load observer and scan DOM on next tick
	setTimeout(() => {
		initObserver(scanDOM);
		scanDOM();
	});
}
