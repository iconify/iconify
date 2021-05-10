import { replaceIDs } from './ids';
import { calculateSize } from './calc-size';
import { fullIcon, IconifyIcon } from '../icon';
import { fullCustomisations } from '../customisations';
import type { IconifyIconCustomisations } from '../customisations';
import { iconToSVG } from '.';
import type { IconifyIconBuildResult } from '.';

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
 * Exported builder functions
 */
export const builderFunctions: IconifyBuilderFunctions = {
	replaceIDs,
	calculateSize,
	buildIcon: (icon, customisations) => {
		return iconToSVG(fullIcon(icon), fullCustomisations(customisations));
	},
};
