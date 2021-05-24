// Core
import { IconifyJSON, IconifyIcon } from '@iconify/types';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
import { IconifyIconBuildResult } from '@iconify/core/lib/builder';
import {
	IconifyStorageFunctions,
	storageFunctions,
} from '@iconify/core/lib/storage/functions';
import {
	IconifyBuilderFunctions,
	builderFunctions,
} from '@iconify/core/lib/builder/functions';

// Local code
import { IconifyCommonFunctions, commonFunctions } from './common';

/**
 * Export required types
 */
// Function sets
export { IconifyStorageFunctions, IconifyBuilderFunctions };

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
 * Iconify interface
 */
export interface IconifyGlobal
	extends IconifyStorageFunctions,
		IconifyBuilderFunctions,
		IconifyCommonFunctions {}

// Export dependencies
export { IconifyGlobal as IconifyGlobalCommon };

/**
 * Global variable
 */
const Iconify: IconifyGlobal = {} as IconifyGlobal;

// Merge with common functions
[storageFunctions, builderFunctions, commonFunctions].forEach((list) => {
	for (const key in list) {
		Iconify[key] = list[key];
	}
});

export default Iconify;
