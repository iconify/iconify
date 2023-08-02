import { AsyncSpriteIcons } from './types';
import { createAndPipeReadableStreamSprite } from './create-sprite';
import { createWriteStream } from 'fs';
import { Writable } from 'stream';
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
