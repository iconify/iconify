import createDebugger from 'debug';
import type {
	CustomIconLoader,
	IconifyLoaderOptions,
	InlineCollection,
} from './types';
import { mergeIconProps } from './utils';
import { trimSVG } from '../svg/trim';

const debug = createDebugger('@iconify-loader:custom');

/**
 * Get custom icon from inline collection or using loader
 */
export async function getCustomIcon(
	custom: CustomIconLoader | InlineCollection,
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions
): Promise<string | undefined> {
	let result: string | undefined | null;

	debug(`${collection}:${icon}`);

	if (typeof custom === 'function') {
		result = await custom(icon);
	} else {
		const inline = custom[icon];
		result = typeof inline === 'function' ? await inline() : inline;
	}

	if (result) {
		if (!result.startsWith('<svg')) {
			console.warn(
				`Custom icon "${icon}" in "${collection}" is not a valid SVG`
			);
			return result;
		}
		const { transform } = options?.customizations ?? {};
		result =
			typeof transform === 'function' ? await transform(result) : result;
		return await mergeIconProps(
			options?.customizations?.trimCustomSvg === true
				? trimSVG(result)
				: result,
			collection,
			icon,
			options,
			undefined
		);
	}
}
