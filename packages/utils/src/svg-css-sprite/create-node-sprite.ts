import { AsyncSpriteIcons, AsyncSpriteIconsFactory } from './types';
import {
	createAndPipeReadableStreamSprite,
	createReadableStreamSprite,
} from './create-sprite';
import { createWriteStream } from 'node:fs';
import { Readable, Writable } from 'node:stream';
import { ServerResponse } from 'node:http';
import { loadCollectionFromFS } from '../loader/fs';
import { AutoInstall } from '../loader/types';
import { opendir, readFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';
import { searchForIcon } from '../loader/modern';

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

export function createSpriteAndPipeToResponse(
	spriteName: string,
	icons: AsyncSpriteIcons | AsyncSpriteIconsFactory,
	response: ServerResponse,
	warn = true
) {
	const readable = Readable.fromWeb(
		createReadableStreamSprite(spriteName, icons, warn)
	);
	readable.on('open', () => {
		response.writeHead(200, {
			'Content-Type': 'image/svg+xml',
		});
		readable.pipe(response);
	});
	readable.on('error', (err) => {
		console.error(
			`error creating/writing SVG icon sprite "${spriteName}"`,
			err
		);
		response.statusCode = 500;
		response.end();
	});
}

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

/*
async function test() {
	const factory = createIconifyCollectionsIconsFactory({
		'flat-color-icons': ['about', 'accept-database'],
	});
	await createAndSaveSprite('my-sprite.svg', 'my-sprite', factory, true);
}

test();
*/
