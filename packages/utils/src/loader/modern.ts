import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import { iconToSVG } from '../svg/build';
import { getIconData } from '../icon-set/get-icon';
import {
	loaderDefaultHeightProp,
	loaderDefaultWidthProp,
	mergeIconProps,
} from './utils';
import { defaultIconCustomisations } from '../customisations/defaults';
import type { IconifyLoaderOptions } from './types';

export async function searchForIcon(
	iconSet: IconifyJSON,
	collection: string,
	ids: string[],
	options?: IconifyLoaderOptions
): Promise<string | undefined> {
	let iconData: IconifyIcon | null;
	const { customize } = options?.customizations ?? {};
	for (const id of ids) {
		iconData = getIconData(iconSet, id);
		if (iconData) {
			let defaultCustomizations: typeof defaultIconCustomisations = {
				...defaultIconCustomisations,
			};
			if (typeof customize === 'function') {
				// Clone icon data to make it mutable
				iconData = Object.assign({}, iconData);
				defaultCustomizations =
					customize(defaultCustomizations, iconData, `${collection}:${id}`) ??
					defaultCustomizations;
			}

			const {
				attributes: { width, height, ...restAttributes },
				body,
			} = iconToSVG(iconData, defaultCustomizations);
			return await mergeIconProps(
				// DON'T remove space on <svg >
				`<svg >${body}</svg>`,
				collection,
				id,
				options,
				() => {
					return {
						...restAttributes,
						...(width ? { [loaderDefaultWidthProp]: width } : {}),
						...(height ? { [loaderDefaultHeightProp]: height } : {}),
					};
				}
			);
		}
	}
}
