// Core
import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import {
	iconExists,
	getIcon,
	addIcon,
	addCollection,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { calculateSize } from '@iconify/utils/lib/svg/size';

// Local code
import type { IconifyCommonFunctions } from './common';
import { getVersion, renderSVG, renderHTML, renderIcon, scan } from './common';
import {
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
} from './observer/index';
import type {
	IconifyRenderMode,
	IconifyIconCustomisations,
} from './scanner/config';

/**
 * Export required types
 */
// Function sets
export { IconifyStorageFunctions, IconifyBuilderFunctions };

// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName };

// Customisations
export { IconifyIconSize, IconifyRenderMode, IconifyIconCustomisations };

// Build
export { IconifyIconBuildResult };

/**
 * Iconify interface
 */
export interface IconifyGlobal
	extends IconifyStorageFunctions,
		IconifyBuilderFunctions,
		IconifyCommonFunctions {}

/**
 * Global variable
 */
const Iconify: IconifyGlobal = {
	// IconifyStorageFunctions
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,

	// IconifyBuilderFunctions
	replaceIDs,
	calculateSize,
	buildIcon,

	// IconifyCommonFunctions
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
};

/**
 * Default export
 */
export default Iconify;

/**
 * Named exports
 */
// IconifyStorageFunctions
export { iconExists, getIcon, listIcons, addIcon, addCollection };

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconifyCommonFunctions
export {
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
};
