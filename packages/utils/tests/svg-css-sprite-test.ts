import { promises as fs } from 'fs';
import type { AsyncSpriteIconsFactory, CustomIconLoader } from '../lib';
import { createAndPipeReadableStreamSprite } from '../lib';
import {
	createFileSystemIconLoaderAsyncIterator,
	createLoadCollectionFromFSAsyncIterator,
} from '../lib/svg-css-sprite/create-node-sprite';
import { expect } from 'vitest';
import { type AsyncSpriteIcons, createSprite } from '../lib';
import { createUint8ArraySprite } from '../lib/svg-css-sprite/create-sprite';

const fixturesDir = './tests/fixtures';

const loader: CustomIconLoader = async (name) => {
	return await fs.readFile(`${fixturesDir}/${name}.svg`, 'utf8');
};

describe('Testing CSS SVG Sprites', () => {
	test('CustomCollection static object', async () => {
		const circle = await loader('circle');
		const spriteString = createSprite('test', {
			circle: circle!,
		});
		expect(spriteString).toMatch(/<svg/);
		expect(spriteString).toMatch(/<symbol id="shapes-circle"/);
		expect(spriteString).toMatch(/<view id="shapes-circle-view"/);
		expect(spriteString).toMatch(/<use href="#shapes-circle"/);
	});
	test('CustomCollection with async iterator', async () => {
		const sprite: string[] = [];
		await createAndPipeReadableStreamSprite(
			'test',
			<AsyncSpriteIcons>{
				async *[Symbol.asyncIterator]() {
					yield {
						name: 'circle',
						svg: await loader('circle'),
					};
				},
			},
			new WritableStream<string>({
				write(chunk) {
					sprite.push(chunk);
				},
			})
		);
		expect(sprite.length > 0).toBeTruthy();
		const spriteString = sprite.join('');
		expect(spriteString).toMatch(/<svg/);
		expect(spriteString).toMatch(/<symbol id="shapes-circle"/);
		expect(spriteString).toMatch(/<view id="shapes-circle-view"/);
		expect(spriteString).toMatch(/<use href="#shapes-circle"/);
	});
	test('CustomCollection with Uint8Array', async () => {
		const result = await createUint8ArraySprite('test', <AsyncSpriteIcons>{
			async *[Symbol.asyncIterator]() {
				yield {
					name: 'circle',
					svg: await loader('circle'),
				};
			},
		});
		expect(result.length > 0).toBeTruthy();
		const spriteString = new TextDecoder().decode(result);
		expect(spriteString).toMatch(/<svg/);
		expect(spriteString).toMatch(/<symbol id="shapes-circle"/);
		expect(spriteString).toMatch(/<view id="shapes-circle-view"/);
		expect(spriteString).toMatch(/<use href="#shapes-circle"/);
	});
	test('CustomCollection with async iterator factory', async () => {
		const sprite: string[] = [];
		await createAndPipeReadableStreamSprite(
			'test',
			<AsyncSpriteIconsFactory>async function* () {
				yield {
					name: 'circle',
					svg: await loader('circle'),
				};
			},
			new WritableStream<string>({
				write(chunk) {
					sprite.push(chunk);
				},
			})
		);
		expect(sprite.length > 0).toBeTruthy();
		const spriteString = sprite.join('');
		expect(spriteString).toMatch(/<svg/);
		expect(spriteString).toMatch(/<symbol id="shapes-circle"/);
		expect(spriteString).toMatch(/<view id="shapes-circle-view"/);
		expect(spriteString).toMatch(/<use href="#shapes-circle"/);
	});
	test('FileSystemIconLoader async iterator factory', async () => {
		const sprite: string[] = [];
		await createAndPipeReadableStreamSprite(
			'test',
			createFileSystemIconLoaderAsyncIterator(fixturesDir, 'test', [
				'circle',
			]),
			new WritableStream<string>({
				write(chunk) {
					sprite.push(chunk);
				},
			})
		);
		expect(sprite.length > 0).toBeTruthy();
		const spriteString = sprite.join('');
		expect(spriteString).toMatch(/<svg/);
		expect(spriteString).toMatch(/<symbol id="shapes-circle"/);
		expect(spriteString).toMatch(/<view id="shapes-circle-view"/);
		expect(spriteString).toMatch(/<use href="#shapes-circle"/);
		expect(spriteString.includes('<symbol id="shapes-1f3eb"')).toBeFalsy();
		expect(
			spriteString.includes('<view id="shapes-1f3eb-view"')
		).toBeFalsy();
		expect(spriteString.includes('<use href="#shapes-1f3eb"')).toBeFalsy();
	});
	test('@iconify-json/flat-color-icons with include option', async () => {
		const sprite: string[] = [];
		const include = ['about', 'accept-database', 'up-right'];
		const exclude = [
			'add-column',
			'add-database',
			'combo-chart',
			'shipped',
			'wikipedia',
			'workflow',
		];
		await createAndPipeReadableStreamSprite(
			'test',
			createLoadCollectionFromFSAsyncIterator('flat-color-icons', {
				autoInstall: false,
				include,
			}),
			new WritableStream<string>({
				write(chunk) {
					sprite.push(chunk);
				},
			})
		);
		expect(sprite.length > 0).toBeTruthy();
		const spriteString = sprite.join('');
		expect(spriteString).toMatch(/<svg/);
		for (const icon of include) {
			expect(
				spriteString.includes(`<symbol id="shapes-${icon}"`)
			).toBeTruthy();
			expect(
				spriteString.includes(`<view id="shapes-${icon}-view"`)
			).toBeTruthy();
			expect(
				spriteString.includes(`<use href="#shapes-${icon}"`)
			).toBeTruthy();
		}
		for (const icon of exclude) {
			expect(
				spriteString.includes(`<symbol id="shapes-${icon}"`)
			).toBeFalsy();
			expect(
				spriteString.includes(`<view id="shapes-${icon}-view"`)
			).toBeFalsy();
			expect(
				spriteString.includes(`<use href="#shapes-${icon}"`)
			).toBeFalsy();
		}
	});
});
