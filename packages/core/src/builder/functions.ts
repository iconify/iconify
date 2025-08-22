import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';

/**
 * Interface for exported builder functions
 */
export interface IconifyBuilderFunctions {
	replaceIDs?: (body: string) => string;
	clearIDCache?: () => void;
	calculateSize: (
		size: string | number,
		ratio: number,
		precision?: number
	) => string | number;
	buildIcon: (
		icon: IconifyIcon,
		customisations?: IconifyIconCustomisations
	) => IconifyIconBuildResult;
}
