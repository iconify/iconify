import { IconifyJSON } from '@iconify/types';
import { stringToIcon } from '@iconify/core/lib/icon/name';
import {
	IconifyIconCustomisations,
	fullCustomisations,
} from '@iconify/core/lib/customisations';
import {
	storageFunctions,
	getIconData,
} from '@iconify/core/lib/storage/functions';
import { iconToSVG, IconifyIconBuildResult } from '@iconify/core/lib/builder';
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
import { findRootNode, addBodyNode } from './modules/root';
// import { finder as iconifyIconFinder } from './finders/iconify-icon';

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
 * Iconify interface
 */
export interface IconifyCommonFunctions {
	/* General section */
	/**
	 * Get version
	 */
	getVersion: () => string;

	/* Render icons */
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
	renderIcon: (
		name: string,
		customisations: IconifyIconCustomisations
	) => IconifyIconBuildResult | null;

	/* Scanner */
	/**
	 * Scan DOM
	 */
	scan: (root?: HTMLElement) => void;

	/* Observer */
	/**
	 * Add root node
	 */
	observe: (root: HTMLElement) => void;

	/**
	 * Remove root node
	 */
	stopObserving: (root: HTMLElement) => void;

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
export const commonFunctions: IconifyCommonFunctions = {
	// Version
	getVersion: () => '__iconify_version__',

	// Render SVG
	renderSVG: (name: string, customisations: IconifyIconCustomisations) => {
		return generateIcon(name, customisations, false) as SVGElement | null;
	},

	renderHTML: (name: string, customisations: IconifyIconCustomisations) => {
		return generateIcon(name, customisations, true) as string | null;
	},

	// Get rendered icon as object that can be used to create SVG (use replaceIDs on body)
	renderIcon: buildIcon,

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
						!storageFunctions.addCollection(item)
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
