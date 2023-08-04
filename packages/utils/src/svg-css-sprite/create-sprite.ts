import {
	AsyncSpriteIcons,
	AsyncSpriteIconsFactory,
	SpriteCollection,
	SpriteEntry_v1,
	SpriteIcon,
	SpriteIcons,
	SpritesContext_v1,
} from './types';
import { yellow } from 'kolorist';
import { ReadableStream } from 'node:stream/web';
import { parseSVGContent } from '../svg/parse';
import { getSVGViewBox } from '../svg/viewbox';

const warned = new Set<string>();

export function createSprite(
	spriteName: string,
	icons: SpriteIcons,
	warn = true
) {
	return `<svg xmlns="http://www.w3.org/2000/svg">${
		Object.entries(typeof icons === 'function' ? icons() : icons).reduce(
			(acc, [name, svg]) => {
				const data = parseSVGData(spriteName, name, svg, warn);
				if (data) {
					acc.content += generateSpriteEntry(acc, data, {
						name,
						svg,
					});
				}

				return acc;
			},
			<SpritesContext_v1>{ content: '' }
		).content
	}
</svg>`;
}

export function createAndPipeReadableStreamSprite(
	spriteName: string,
	icons: AsyncSpriteIcons | AsyncSpriteIconsFactory,
	writableStream: WritableStream,
	warn = true,
	options?: StreamPipeOptions
) {
	return createReadableStreamSprite(spriteName, icons, warn).pipeTo(
		writableStream,
		options
	);
}

export function createReadableStreamSprite(
	spriteName: string,
	icons: AsyncSpriteIcons | AsyncSpriteIconsFactory,
	warn = true
) {
	const context: SpritesContext_v1 = { content: '' };
	const iterator =
		typeof icons === 'function' ? icons() : icons[Symbol.asyncIterator]();
	return new ReadableStream({
		start(controller) {
			controller.enqueue('<svg xmlns="http://www.w3.org/2000/svg">');
		},
		async pull(controller) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { value, done } = await iterator.next();
			if (done) {
				controller.enqueue('\n</svg>');
				controller.close();
			} else {
				const data = parseSVGData(
					spriteName,
					value.name,
					value.svg,
					warn
				);
				controller.enqueue(
					data ? generateSpriteEntry(context, data, value) : ''
				);
			}
		},
	});
}

export function createAsyncSpriteIconsFactory(
	collections: SpriteCollection | SpriteCollection[],
	mapIconName: (icon: string, collection?: string) => string = (icon) => icon
) {
	const collectionsArray = Array.isArray(collections)
		? collections
		: [collections];

	return <AsyncSpriteIconsFactory>async function* () {
		for (const collection of collectionsArray) {
			if (Array.isArray(collection)) {
				for (const icon of collection) {
					yield {
						name: mapIconName(icon.name, icon.collection),
						svg: icon.svg,
					};
				}
			} else if ('svg' in collection) {
				yield {
					name: mapIconName(collection.name, collection.collection),
					svg: collection.svg,
				};
			} else if (typeof collection === 'function') {
				const iterator = collection();
				for await (const icon of iterator) {
					yield {
						name: mapIconName(icon.name, icon.collection),
						svg: icon.svg,
					};
				}
			} else {
				for await (const icon of collection) {
					yield {
						name: mapIconName(icon.name, icon.collection),
						svg: icon.svg,
					};
				}
			}
		}
	};
}

function generateSpriteEntry(
	context: SpritesContext_v1,
	data: SpriteEntry_v1,
	icon: SpriteIcon
) {
	const y = context.minY ?? 0;
	const entry = `
  <symbol id="shapes-${icon.name}" viewBox="${data.rawViewBox}">${data.content}</symbol>
  <view id="shapes-${icon.name}-view" viewBox="${data.x} ${y} ${data.width} ${data.height}"/>
  <use href="#shapes-${icon.name}" x="${data.x}" y="${y}" id="${icon.name}"/>`;
	context.minY = y + data.height + 1;
	return entry;
}

function parseSVGData(
	spriteName: string,
	name: string,
	data: string,
	warn: boolean
) {
	const parsed = parseSVGContent(data);
	const rawViewBox = parsed?.attribs['viewBox'] ?? '';
	const viewBox = getSVGViewBox(rawViewBox);
	if (!parsed || !viewBox) {
		const key = `${spriteName}:${name}`;
		if (warn && !warned.has(key)) {
			warned.add(key);
			console.warn(
				yellow(
					`[@iconify-svg-css-sprite] missing or wrong viewBox in "${name}" SVG icon: excluded from "${spriteName}" sprite!`
				)
			);
		}
		return;
	}

	if (data.includes('<style') || data.includes('<animation')) {
		const key = `${spriteName}:${name}`;
		if (warn && !warned.has(key)) {
			warned.add(key);
			console.warn(
				yellow(
					`[@iconify-svg-css-sprite] "${name}" SVG icon includes <style>/<animation>: should be excluded from "${spriteName}" sprite since it will affect all other icons!`
				)
			);
		}
	}

	return <SpriteEntry_v1>{
		rawViewBox,
		content: parsed.body,
		x: viewBox[0],
		y: viewBox[1],
		width: viewBox[2],
		height: viewBox[3],
	};
}
/*
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
	await createAndPipeReadableStreamSprite(
		'xx',
		icons(),
		new WritableStream({
			write(chunk) {
				console.log(chunk);
			},
		}),
		true
	);
}

test();
*/
