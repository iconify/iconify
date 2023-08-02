import { AsyncSpriteIcons } from './types';
import {
	createAndPipeReadableStreamSprite,
	createReadableStreamSprite,
} from './create-sprite';
import { createWriteStream } from 'fs';
import { Readable, Writable } from 'stream';
import { ServerResponse } from 'http';
import { loadNodeIcon } from '../loader/node-loader';

export function createAndSaveSprite(
	fileName: string,
	spriteName: string,
	icons: AsyncSpriteIcons,
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
	icons: AsyncSpriteIcons,
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
		response.setHeader('Content-Type', 'text/plain');
		response.statusCode = 404;
		response.end('Not found');
	});
}

async function test() {
	async function* icons() {
		const icons = ['about', 'accept-database'];
		for (const name of icons) {
			yield await loadNodeIcon('flat-color-icons', name).then((i) => ({
				name,
				svg: i!,
			}));
		}
	}
	await createAndSaveSprite('my-sprite.svg', 'my-sprite', icons(), true);
}

test();
