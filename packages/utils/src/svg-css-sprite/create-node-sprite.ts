import { AsyncSpriteIcons, AsyncSpriteIconsFactory } from './types';
import {
	createAndPipeReadableStreamSprite,
	createReadableStreamSprite,
} from './create-sprite';
import { createWriteStream } from 'node:fs';
import { Writable } from 'node:stream';
import { loadCollectionFromFS } from '../loader/fs';
import { AutoInstall } from '../loader/types';
import { opendir, readFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';
import { searchForIcon } from '../loader/modern';

/**
 * Create CSS SVG Sprite from async iterable iterators icons sources and save the sprite to a file.
 * @param fileName The file name to save the sprite to.
 * @param spriteName The name of the sprite.
 * @param icons async iterable iterator icons sources to add to the sprite.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 */
export function createAndSaveSprite(
	fileName: string,
	spriteName: string,
	icons: AsyncSpriteIcons | AsyncSpriteIconsFactory,
	warn = true
) {
	return createAndPipeReadableStreamSprite(
		spriteName,
		icons,
		Writable.toWeb(
			createWriteStream(
				`${fileName}${fileName.endsWith('.svg') ? '' : '.svg'}`
			)
		),
		warn
	);
}

/**
 * Utility helper to create async iterable icon sources from Iconify JSON collection package.
 * @param collection The collection name: for example, to create a sprite using `@iconify-json/mdi` package, just provide `mdi`.
 * @param options The options to create the sprite:
 * - `autoInstall`: should auto install the package if not found?
 * - `include`: include only specific icons.
 */
export function createLoadCollectionFromFSAsyncIterator(
	collection: string,
	options: {
		autoInstall?: AutoInstall;
		include?: string[] | ((icon: string) => boolean);
	} = { autoInstall: false }
) {
	const include = options.include ?? (() => true);
	const useInclude: (icon: string) => boolean =
		typeof include === 'function'
			? include
			: (icon: string) => include.includes(icon);

	return <AsyncSpriteIconsFactory>async function* () {
		const iconSet = await loadCollectionFromFS(collection);
		if (iconSet) {
			const icons = Object.keys(iconSet.icons).filter(useInclude);
			for (const id of icons) {
				const iconData = await searchForIcon(
					iconSet,
					collection,
					[id],
					options
				);
				if (iconData) {
					yield {
						name: id,
						svg: iconData,
						collection,
					};
				}
			}
		}
	};
}

/**
 * Utility helper to create async iterable icon sources from a directory containing SVG files.
 * @param dir The directory containing the SVG files.
 * @param collection The collection name, if not provided, the directory name will be used.
 * @param include include only specific icons.
 */
export function createFileSystemIconLoaderAsyncIterator(
	dir: string,
	collection = dirname(dir),
	include: string[] | ((icon: string) => boolean) = () => true
) {
	const useInclude: (icon: string) => boolean =
		typeof include === 'function'
			? include
			: (icon: string) => include.includes(icon);

	return <AsyncSpriteIconsFactory>async function* () {
		const stream = await opendir(dir);
		for await (const file of stream) {
			if (!file.isFile() || extname(file.name) !== '.svg') continue;

			const name = basename(file.name).slice(0, -4);
			if (useInclude(name)) {
				yield {
					name,
					svg: await readFile(resolve(dir, file.name), 'utf-8'),
					collection,
				};
			}
		}
	};
}
