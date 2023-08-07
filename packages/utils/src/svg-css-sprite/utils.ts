import { GeneratedUint8ArraySprite, SpriteCollections } from './types';
import { IconifyLoaderOptions } from '../loader/types';
import { mergeIconProps } from '../loader/utils';
import { trimSVG } from '../svg/trim';
import {
	createAsyncSpriteIconsFactory,
	createUint8ArraySprite,
} from './create-sprite';

/**
 * Apply customizations to SVG.
 * @param collection The collection name.
 * @param icon The icon name.
 * @param svg The SVG icon.
 * @param options The loader options.
 */
export async function customizeSpriteIcon(
	collection: string,
	icon: string,
	svg: string,
	options?: IconifyLoaderOptions
) {
	if (!options) return svg;

	const cleanupIdx = svg.indexOf('<svg');
	if (cleanupIdx > 0) svg = svg.slice(cleanupIdx);

	const { transform } = options?.customizations ?? {};
	svg =
		typeof transform === 'function'
			? await transform(svg, collection, icon)
			: svg;

	if (!svg.startsWith('<svg')) {
		console.warn(
			`Custom icon "${icon}" in "${collection}" is not a valid SVG`
		);
		return svg;
	}

	return await mergeIconProps(
		trimSVG(svg),
		collection,
		icon,
		options,
		undefined
	);
}

/**
 * Utility helper to load SVG icon from the sprite collections.
 * @param collectionName The collection name.
 * @param icon The icon to load.
 * @param collections The collection SVG icons sources.
 * @param options The loader options: apply the customizations to the SVG.
 */
export async function loadSvgFromSprite(
	collectionName: string,
	icon: string,
	collections: SpriteCollections,
	options?: IconifyLoaderOptions
) {
	const collectionsArray = Array.isArray(collections)
		? collections
		: [collections];

	for (const collection of collectionsArray) {
		if (Array.isArray(collection)) {
			for (const spriteIcon of collection) {
				if (spriteIcon.name === icon) {
					return await customizeSpriteIcon(
						collectionName,
						icon,
						spriteIcon.svg,
						options
					);
				}
			}
		} else if ('svg' in collection) {
			if (collection.name === icon) {
				return await customizeSpriteIcon(
					collectionName,
					icon,
					collection.svg,
					options
				);
			}
		} else if (typeof collection === 'function') {
			for await (const spriteIcon of collection()) {
				if (spriteIcon.name === icon) {
					return await customizeSpriteIcon(
						collectionName,
						icon,
						spriteIcon.svg,
						options
					);
				}
			}
		} else {
			for await (const spriteIcon of collection[Symbol.asyncIterator]()) {
				if (spriteIcon.name === icon) {
					return await customizeSpriteIcon(
						collectionName,
						icon,
						spriteIcon.svg,
						options
					);
				}
			}
		}
	}
}

/**
 * Utility helper to create a sprite loader.
 * @param collectionResolver Sprite collections resolver.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 */
export function createCSSSVGUint8ArraySpriteLoader(
	collectionResolver: (collection: string) => SpriteCollections,
	warn = true
) {
	return async (collection: string) => {
		const collections = collectionResolver(collection);
		if (!collections) return undefined;

		return await createUint8ArraySprite(
			collection,
			createAsyncSpriteIconsFactory(collections),
			warn
		);
	};
}

/**
 * Utility helper to create a factory to generate [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) CSS SVG Sprites.
 * @param sprites The sprites to generate.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 */
export function createUint8ArraySpriteFactory(
	sprites: Record<string, SpriteCollections>,
	warn = true
) {
	return async function* () {
		for (const [collection, collections] of Object.entries(sprites)) {
			yield <GeneratedUint8ArraySprite>{
				name: collection,
				asset: await createUint8ArraySprite(
					collection,
					createAsyncSpriteIconsFactory(collections),
					warn
				),
			};
		}
	};
}
