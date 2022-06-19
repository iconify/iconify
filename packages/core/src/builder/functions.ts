import type { IconifyIcon } from '@iconify/types';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { defaultIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { mergeCustomisations } from '@iconify/utils/lib/customisations/merge';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations/defaults';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';

/**
 * Interface for exported builder functions
 */
export interface IconifyBuilderFunctions {
	replaceIDs?: (body: string, prefix?: string | (() => string)) => string;
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

/**
 * Build icon
 */
export function buildIcon(
	icon: IconifyIcon,
	customisations?: IconifyIconCustomisations
): IconifyIconBuildResult {
	return iconToSVG(
		{ ...defaultIconProps, ...icon },
		customisations
			? mergeCustomisations(defaultIconCustomisations, customisations)
			: defaultIconCustomisations
	);
}
