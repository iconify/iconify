import {
	AsyncSpriteIcons,
	AsyncSpriteIconsFactory,
	SpriteCollections,
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

/**
 * Create CSS SVG Sprite from SVG sources icons.
 * @param spriteName The name of the sprite.
 * @param icons Icons to add to the sprite: record with icon names and SVG content.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 */
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

/**
 * Create CSS SVG Sprite using async iterables icons sources and streams.
 * @param spriteName The sprite name.
 * @param icons async iterable iterator icons sources to add to the sprite.
 * @param writableStream The writable target stream.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 * @param options The options to use in the stream pipe.
 */
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

/**
 * Create [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) CSS SVG Sprite using async iterables icon sources.
 * @param spriteName The sprite name.
 * @param icons async iterable iterator of icons to add to the sprite.
 * @param options The options for creating the sprite.
 */
export async function createUint8ArraySprite(
	spriteName: string,
	icons: AsyncSpriteIcons | AsyncSpriteIconsFactory,
	options:
		| boolean
		| {
				warn?: boolean;
				callback?: (chunk: DataView) => void | Promise<void>;
		  } = false
) {
	const textEncoder = new TextEncoder();
	const context: SpritesContext_v1 = { content: '' };
	const warn =
		typeof options === 'boolean' ? options : options?.warn === true;
	const callback =
		typeof options === 'object' ? options?.callback : undefined;
	const iterator =
		typeof icons === 'function' ? icons() : icons[Symbol.asyncIterator]();
	const chunks = [
		textEncoder.encode('<svg xmlns="http://www.w3.org/2000/svg">').buffer,
	];
	for await (const value of iterator) {
		const data = parseSVGData(spriteName, value.name, value.svg, warn);
		if (data) {
			chunks.push(
				textEncoder.encode(generateSpriteEntry(context, data, value))
					.buffer
			);
		}
	}
	chunks.push(textEncoder.encode('</svg>').buffer);
	const totalByteLength = chunks.reduce(
		(acc, chunk) => acc + chunk.byteLength,
		0
	);
	const concatenatedBuffer = new ArrayBuffer(totalByteLength);
	const dataView = new DataView(concatenatedBuffer);
	let offset = 0;

	// Concatenate the chunks into a single ArrayBuffer
	for (const chunk of chunks) {
		const chunkDataView = new DataView(chunk);
		for (let i = 0; i < chunk.byteLength; i++) {
			dataView.setUint8(offset + i, chunkDataView.getUint8(i));
		}
		offset += chunk.byteLength;
	}

	await callback?.(dataView);

	// Convert the concatenated ArrayBuffer to a Uint8Array
	return new Uint8Array(concatenatedBuffer);
}

/**
 * Create a [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) CSS SVG Sprite using async iterables icon sources.
 * @param spriteName The sprite name.
 * @param icons async iterable iterator icon sources to add to the sprite.
 * @param warn Display warning if icon contains code that can break other icons inside the sprite (animation, style).
 */
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

/**
 * Utility helper to convert sprite icons sources to async iterable icons source.
 * @param collections The CSS SVG Sprite SVG icons sources.
 * @param mapIconName A function to map the icon name, by default will use the icon name.
 */
export function createAsyncSpriteIconsFactory(
	collections: SpriteCollections,
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
				for await (const icon of collection[Symbol.asyncIterator]()) {
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
