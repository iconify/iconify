import { AsyncSpriteIcons, SpriteEntry, SpriteIcons, Sprites } from './types';
import { yellow } from 'kolorist';
import { loadNodeIcon } from '../loader/node-loader';

const warned = new Set<string>();

export function createSprite(
	spriteName: string,
	icons: SpriteIcons,
	warn = true
) {
	return `<svg xmlns="http://www.w3.org/2000/svg">${
		Object.entries(typeof icons === 'function' ? icons() : icons).reduce(
			(acc, [name, icon]) => {
				const data = parseSVGData(spriteName, name, icon, warn);
				if (data) {
					const newY = acc.previous ? acc.previous.y + 1 : data.y;
					acc.content += `
  <symbol id="shapes-${name}" viewBox="${data.rawViewBox}">${data.content}</symbol>
  <view id="shapes-${name}-view" viewBox="${data.x} ${newY} ${data.width} ${data.height}"/>
  <use href="#shapes-${name}" x="${data.x}" y="${newY}" id="${name}"/>`;
					acc.previous = {
						y: data.height + (acc.previous ? acc.previous.y : 0),
					};
				}
				return acc;
			},
			<Sprites>{ content: '' }
		).content
	}
</svg>`;
}

export async function createReadableStreamSprite(
	spriteName: string,
	icons: AsyncSpriteIcons,
	writableStream: WritableStream,
	warn = true
) {
	const context: Sprites = { content: '' };
	await new ReadableStream({
		start(controller) {
			controller.enqueue('<svg xmlns="http://www.w3.org/2000/svg">');
		},
		async pull(controller) {
			const { value, done } = await icons.next();
			if (done) {
				controller.enqueue('</svg>');
				controller.close();
			} else {
				const data = parseSVGData(
					spriteName,
					value.name,
					value.svg,
					warn
				);
				if (data) {
					const newY = context.previous
						? context.previous.y + 1
						: data.y;
					const entry = `
  <symbol id="shapes-${value.name}" viewBox="${data.rawViewBox}">${data.content}</symbol>
  <view id="shapes-${value.name}-view" viewBox="${data.x} ${newY} ${data.width} ${data.height}"/>
  <use href="#shapes-${value.name}" x="${data.x}" y="${newY}" id="${value.name}"/>`;
					context.previous = {
						y:
							data.height +
							(context.previous ? context.previous.y : 0),
					};
					controller.enqueue(entry);
				}
			}
		},
	}).pipeTo(writableStream, { preventClose: true });
}

function parseSVGData(
	spriteName: string,
	name: string,
	data: string,
	warn: boolean
) {
	const match = data.match(
		/<svg[^>]+viewBox="([^"]+)"[^>]*>([\s\S]+)<\/svg>/
	);
	if (!match) {
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

	const [, viewBox, path] = match;
	const [x, y, width, height] = viewBox.split(' ').map(Number);
	return <SpriteEntry>{
		rawViewBox: match[1],
		content: path,
		x,
		y,
		width,
		height,
	};
}

async function test() {
	async function* icons() {
		yield await loadNodeIcon('flat-color-icons', 'about').then((i) => ({
			name: 'about',
			svg: i!,
		}));
		yield await loadNodeIcon('flat-color-icons', 'accept-database').then(
			(i) => ({ name: 'accept-database', svg: i! })
		);
	}
	await createReadableStreamSprite(
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
