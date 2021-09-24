// Core
import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/utils/lib/customisations';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import { storageFunctions } from '@iconify/core/lib/storage/functions';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { builderFunctions } from '@iconify/core/lib/builder/functions';

// Local code
import type { IconifyCommonFunctions } from './common';
import { commonFunctions } from './common';

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
