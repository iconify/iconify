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

// Local code
import { IconifyExposedCommonInternals } from './internals';
import { IconifyGlobal as IconifyGlobal1, IconifyCommon } from './common';

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
export interface IconifyGlobal2 {
	/**
	 * Expose internal functions
	 */
	_internal: IconifyExposedInternals;
}

/**
 * Iconify interface
 */
export interface IconifyGlobal extends IconifyGlobal1, IconifyGlobal2 {}

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
} as IconifyGlobal2) as IconifyGlobal;

// Merge with common functions
for (const key in IconifyCommon) {
	Iconify[key] = IconifyCommon[key];
}

export default Iconify;
