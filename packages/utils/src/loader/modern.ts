import type { IconifyJSON, IconifyIcon } from '@iconify/types';
import { iconToSVG, isUnsetKeyword } from '../svg/build';
import { getIconData } from '../icon-set/get-icon';
import { calculateSize } from '../svg/size';
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
			let defaultCustomizations: typeof defaultIconCustomisations = {
				...defaultIconCustomisations,
			};
			if (typeof customize === 'function') {
				// Clone icon data to make it mutable
				iconData = Object.assign({}, iconData);
				defaultCustomizations =
					customize(
						defaultCustomizations,
						iconData,
						`${collection}:${id}`
					) ?? defaultCustomizations;
			}

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
					// Check if value has 'unset' keyword
					const check = (
						prop: 'width' | 'height',
						defaultValue: string | undefined
					) => {
						const propValue = props[prop];
						let value: string | undefined;

						if (!isUnsetKeyword(propValue)) {
							if (propValue) {
								// Do not change it
								return;
							}

							if (typeof scale === 'number') {
								// Scale icon, unless scale is 0
								if (scale) {
									value = calculateSize(
										// Base on result from iconToSVG() or 1em
										defaultValue ?? '1em',
										scale
									);
								}
							} else {
								// Use result from iconToSVG()
								value = defaultValue;
							}
						}

						// Change / unset
						if (!value) {
							delete props[prop];
						} else {
							props[prop] = value;
						}
					};
					check('width', width);
					check('height', height);
				}
			);
		}
	}
}
