import type { IconifyIcon } from '@iconify/types';
import { fullIcon } from '@iconify/utils/lib/icon';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/utils/lib/customisations';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';

/**
 * Interface for exported builder functions
 */
export interface IconifyBuilderFunctions {
	replaceIDs: (body: string, prefix?: string | (() => string)) => string;
	calculateSize: (
		size: string | number,
		ratio: number,
		precision?: number
	) => string | number;
	buildIcon: (
		icon: IconifyIcon,
		customisations: IconifyIconCustomisations
	) => IconifyIconBuildResult;
}

/**
 * Build icon
 */
export function buildIcon(
	icon: IconifyIcon,
	customisations: IconifyIconCustomisations
): IconifyIconBuildResult {
	return iconToSVG(
		fullIcon(icon),
		customisations
			? mergeCustomisations(defaults, customisations)
			: defaults
	);
}
