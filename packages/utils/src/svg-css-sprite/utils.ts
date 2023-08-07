import { GeneratedUint8ArraySprite, SpriteCollections } from './types';
import { IconifyLoaderOptions } from '../loader/types';
import { mergeIconProps } from '../loader/utils';
import { trimSVG } from '../svg/trim';
import {
	createAsyncSpriteIconsFactory,
	createUint8ArraySprite,
} from './create-sprite';

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
