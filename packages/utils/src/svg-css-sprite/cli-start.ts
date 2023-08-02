import cac from 'cac';
import { consola } from 'consola';
import { green, red } from 'kolorist';
// @ts-ignore
import { version } from '../../package.json';
import { createConfigLoader } from 'unconfig';
import type { SpritesConfig } from './types';
import { createAsyncSpriteIconsFactory } from './create-sprite';
import { createAndSaveSprite } from './create-node-sprite';
import { resolve } from 'node:path';

interface CliOptions {
	root?: string;
	config?: string;
	outdir?: string;
	silent?: boolean;
}

export async function startCli(args: string[] = process.argv) {
	const cli = cac('svg-css-sprite-generator');

	cli.version(version)
		.option('-r, --root <path>', 'Root path')
		.option('-c, --config <path>', 'Path to config file')
		.option('-o, --outdir <path>', 'Outdir relative to root or cwd')
		.option('-s, --silent', 'Disable warnings')
		.help()
		.command('', 'Iconify CSS SVG Sprite Generator')
		.action((options) => run(options));

	cli.parse(args);
}

async function run(cliOptions: CliOptions = { silent: false }) {
	consola.log(green(`Iconify CSS SVG Sprite Generator v${version}`));
	consola.start('Preparing to generate CSS SVG Sprites...');

	const cwd = cliOptions?.root ?? process.cwd();

	const loader = createConfigLoader<SpritesConfig>({
		sources: [
			{
				files: ['svg-css-sprite.config'],
				extensions: ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'],
			},
		],
		cwd,
		defaults: { sprites: {} },
	});

	const result = await loader.load();

	const sprites = result.config.sprites;

	consola.ready('CSS SVG Sprites ready to be generated');
	consola.start(
		`Generating CSS SVG Sprites: ${Object.keys(sprites).join(', ')}`
	);

	const generationResult = await Promise.all(
		Object.values(sprites).map(async (sprite) => {
			const path = resolve(
				cwd,
				sprite.outdir ?? cliOptions.outdir ?? './',
				`${sprite.name}.svg`
			);
			return createAndSaveSprite(
				path,
				sprite.name,
				createAsyncSpriteIconsFactory(
					sprite.collection,
					sprite.mapIconName
				),
				!cliOptions.silent
			)
				.then(() => {
					consola.ready(
						green(
							`CSS SVG Sprite ${sprite.name} generated: ${path}`
						)
					);
					return Promise.resolve(undefined);
				})
				.catch((err) => {
					consola.error(
						red(
							`CSS SVG Sprite ${sprite.name} failed to generate: ${path}`
						)
					);
					return Promise.resolve(err);
				});
		})
	);

	const errors = generationResult.filter((err) => err !== undefined);

	if (errors.length > 0) {
		consola.ready('CSS SVG Sprites finished with errors:');
		consola.error(errors.map((err) => red(err.message)).join('\n'));
	} else {
		consola.ready('CSS SVG Sprites generated');
	}
}
