// Core
import { IconifyJSON } from '@iconify/types';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { IconifyIcon } from '@iconify/core/lib/icon';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';
import { IconifyIconBuildResult } from '@iconify/core/lib/builder';
import { calcSize } from '@iconify/core/lib/builder/calc-size';
import {
	IconifyStorageFunctions,
	storageFunctions,
} from '@iconify/core/lib/storage/functions';

// Local code
import { IconifyExposedCommonInternals } from './internals';
import { IconifyCommonFunctions, commonFunctions } from './common';

/**
 * Export required types
 */
// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName };

// Customisations
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
};

// Build
export { IconifyIconBuildResult };

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconifyExposedInternals
	extends IconifyExposedCommonInternals {}

/**
 * Exported functions
 */
export interface IconifyFunctions {
	/**
	 * Expose internal functions
	 */
	_internal: IconifyExposedInternals;
}

/**
 * Iconify interface
 */
export interface IconifyGlobal
	extends IconifyStorageFunctions,
		IconifyCommonFunctions,
		IconifyFunctions {}

// Export dependencies
export { IconifyGlobal as IconifyGlobalCommon };

/**
 * Global variable
 */
const Iconify: IconifyGlobal = ({
	// Exposed internal functions
	_internal: {
		// Calculate size
		calculateSize: calcSize,
	},
} as IconifyFunctions) as IconifyGlobal;

// Merge with common functions
[storageFunctions, commonFunctions].forEach((list) => {
	for (const key in list) {
		Iconify[key] = list[key];
	}
});

export default Iconify;
