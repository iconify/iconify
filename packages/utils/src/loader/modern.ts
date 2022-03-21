import type { IconifyJSON } from '@iconify/types';
import type { FullIconifyIcon } from '../icon';
import { iconToSVG } from '../svg/build';
import { getIconData } from '../icon-set/get-icon';
import { mergeIconProps } from './utils';
import createDebugger from 'debug';
import { defaults as DefaultIconCustomizations } from '../customisations';
import type { IconifyLoaderOptions } from './types';

const debug = createDebugger('@iconify-loader:icon');

export async function searchForIcon(
	iconSet: IconifyJSON,
	collection: string,
	ids: string[],
	options?: IconifyLoaderOptions
): Promise<string | undefined> {
	let iconData: FullIconifyIcon | null;
	const { customize } = options?.customizations ?? {};
	for (const id of ids) {
		iconData = getIconData(iconSet, id, true);
		if (iconData) {
			debug(`${collection}:${id}`);
			const defaultCustomizations = { ...DefaultIconCustomizations };
			const { attributes, body } = iconToSVG(
				iconData,
				typeof customize === 'function'
					? customize(defaultCustomizations)
					: defaultCustomizations
			);
			return await mergeIconProps(
				// DON'T remove space on <svg >
				`<svg >${body}</svg>`,
				collection,
				id,
				false,
				options,
				() => attributes
			);
		}
	}
}
