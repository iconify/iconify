import { AsyncSpriteIcons, AsyncSpriteIconsFactory } from './types';
import {
	createAndPipeReadableStreamSprite,
	createReadableStreamSprite,
} from './create-sprite';
import { createWriteStream } from 'node:fs';
import { Readable, Writable } from 'node:stream';
import { ServerResponse } from 'node:http';
import { loadNodeIcon } from '../loader/node-loader';

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

export function createIconifyCollectionsIconsFactory(
	collections: Record<string, string | string[]>,
	mapName: (collection: string, icon: string) => string = (_, icon) => icon
): AsyncSpriteIconsFactory {
	return async function* () {
		const entries = Object.entries(collections);
		for (const [collection, icons] of entries) {
			if (typeof icons === 'string') {
				yield await loadNodeIcon(collection, icons)
					.then((svg) => ({
						name: mapName(collection, icons),
						svg: svg ?? '',
					}))
					.catch((err) => {
						console.error(
							`error loading icon "${icons}" from collection "${collection}"`,
							err
						);
						return {
							name: mapName(collection, icons),
							svg: '',
						};
					});
			} else {
				for (const icon of icons) {
					yield await loadNodeIcon(collection, icon)
						.then((svg) => ({
							name: mapName(collection, icon),
							svg: svg ?? '',
						}))
						.catch((err) => {
							console.error(
								`error loading icon "${icon}" from collection "${collection}"`,
								err
							);
							return {
								name: mapName(collection, icon),
								svg: '',
							};
						});
				}
			}
		}
	};
}

async function test() {
	const factory = createIconifyCollectionsIconsFactory({
		'flat-color-icons': ['about', 'accept-database'],
	});
	await createAndSaveSprite('my-sprite.svg', 'my-sprite', factory, true);
}

test();
