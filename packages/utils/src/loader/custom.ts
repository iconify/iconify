import type { Awaitable } from '@antfu/utils';
import createDebugger from 'debug';
import type { CustomIconLoader, InlineCollection } from './types';

const debug = createDebugger('@iconify-loader:custom');

export async function getCustomIcon(
	custom: CustomIconLoader | InlineCollection,
	collection: string,
	icon: string,
	transform?: (svg: string) => Awaitable<string>
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
		if (!result.startsWith('<svg ')) {
			console.warn(
				`Custom icon "${icon}" in "${collection}" is not a valid SVG`
			);
		}
		return transform ? await transform(result) : result;
	}
}
