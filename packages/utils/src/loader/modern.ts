import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import { iconToSVG } from '../svg/build';
import { getIconData } from '../icon-set/get-icon';
import { mergeIconProps } from './utils';
import createDebugger from 'debug';
import { defaultIconCustomisations } from '../customisations/defaults';
import type { IconifyLoaderOptions } from './types';

const debug = createDebugger('@iconify-loader:icon');

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
			debug(`${collection}:${id}`);
			let defaultCustomizations = { ...defaultIconCustomisations };
			if (typeof customize === 'function')
				defaultCustomizations = customize(defaultCustomizations);

			const {
				attributes: { width, height, ...restAttributes },
				body,
			} = iconToSVG(iconData, defaultCustomizations);
			const scale = options?.scale;
			return await mergeIconProps(
				// DON'T remove space on <svg >
				`<svg >${body}</svg>`,
				collection,
				id,
				options,
				() => {
					return { ...restAttributes };
				},
				(props) => {
					if (
						typeof props.width === 'undefined' ||
						props.width === null
					) {
						if (typeof scale === 'number') {
							props.width = `${scale}em`;
						} else {
							props.width = width;
						}
					}
					if (
						typeof props.height === 'undefined' ||
						props.height === null
					) {
						if (typeof scale === 'number') {
							props.height = `${scale}em`;
						} else {
							props.height = height;
						}
					}
				}
			);
		}
	}
}
