import cac from 'cac';
import { consola } from 'consola';
import { green, red } from 'colorette';
import { version } from '../../package.json';
import { createConfigLoader } from 'unconfig';
import type { SpritesConfiguration } from '@iconify/utils/lib/svg-css-sprite/types';
import { createAsyncSpriteIconsFactory } from '@iconify/utils/lib/svg-css-sprite/create-sprite';
import { createAndSaveSprite } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';
import { resolve } from 'node:path';

interface CliOptions {
	root?: string;
	config?: string;
	outdir?: string;
	silent?: boolean;
}

// @typescript-eslint/require-await
export async function startCli(args: string[] = process.argv) {
	const cli = cac('svg-css-sprite-generator');

	cli.version(version)
		.option('-r, --root <path>', 'Root path')
		.option(
			'-c, --config <path>',
			'Path to config file relative to root path or cwd'
		)
		.option(
			'-o, --outdir <path>',
			'Output directory relative to root or cwd'
		)
		.option('-s, --silent', 'Disable warnings')
		.help()
		.command('', 'Iconify CSS SVG Sprite Generator')
		.action((options) => run(options));

	cli.parse(args);
}

async function run(cliOptions: CliOptions = { silent: false }) {
	consola.log(green(`Iconify CSS SVG Sprite Generator v${version}`));
	consola.start('Preparing to generate CSS SVG Sprites...');

	const { cwd, config } = await loadConfig(cliOptions);

	consola.ready('CSS SVG Sprites ready to be generated');
	consola.start(
		`Generating CSS SVG Sprites: ${Object.keys(config.sprites).join(', ')}`
	);

	const generationResult = await Promise.all<Error | undefined>(
		Object.values(config.sprites).map(async (sprite) => {
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
		consola.error(errors.map((err) => red(err!.message)).join('\n'));
	} else {
		consola.ready('CSS SVG Sprites generated');
	}
}

async function loadConfig(cliOptions: CliOptions) {
	console.log(cliOptions);

	const cwd = cliOptions?.root ?? process.cwd();

	// todo: load configuration file properly

	const loader = createConfigLoader<SpritesConfiguration>({
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

	return { cwd, config: result.config };
}
