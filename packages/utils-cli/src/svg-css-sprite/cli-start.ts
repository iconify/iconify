import cac from 'cac';
import { consola } from 'consola';
import { green, red } from 'colorette';
import { version } from '../../package.json';
import { createConfigLoader } from 'unconfig';
import type { SpritesConfiguration } from '@iconify/utils/lib/svg-css-sprite/types';
import { createAsyncSpriteIconsFactory } from '@iconify/utils/lib/svg-css-sprite/create-sprite';
import { createAndSaveSprite } from '@iconify/utils/lib/svg-css-sprite/create-node-sprite';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';

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

	const sprites = Array.isArray(config.sprites)
		? config.sprites
		: [config.sprites];

	consola.ready('CSS SVG Sprites ready to be generated');
	consola.ready(
		`cwd: ${
			isAbsolute(cwd)
				? cwd.replace(/\\/g, '/')
				: resolve(cwd).replace(/\\/g, '/')
		}`
	);
	consola.start(
		`Generating CSS SVG Sprites: ${sprites.map((s) => s.name).join(', ')}`
	);

	const generationResult = await Promise.all<Error | undefined>(
		sprites.map(async (sprite) => {
			const path = resolve(
				cwd,
				sprite.outdir ?? cliOptions.outdir ?? './',
				`${sprite.name}${sprite.name.endsWith('.svg') ? '' : '.svg'}`
			);
			try {
				await createAndSaveSprite(
					path,
					sprite.name,
					createAsyncSpriteIconsFactory(
						sprite.collection,
						sprite.mapIconName
					),
					!cliOptions.silent
				);
				consola.ready(
					green(
						`CSS SVG Sprite ${sprite.name} generated: ${relative(
							cwd,
							path
						)}`
					)
				);
			} catch (e) {
				consola.error(
					red(
						`CSS SVG Sprite ${sprite.name} failed to generate: ${path}`
					)
				);
				return Promise.resolve(e as unknown as Error);
			}

			return Promise.resolve(undefined);
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
	let cwd = cliOptions?.root ?? process.cwd();

	const resolved = cliOptions.config
		? resolve(cwd, cliOptions.config)
		: undefined;

	let isFile = false;
	if (resolved && existsSync(resolved) && statSync(resolved).isFile()) {
		isFile = true;
		cwd = dirname(resolved).replace(/\\/g, '/');
	}

	const loader = createConfigLoader<SpritesConfiguration>({
		sources: isFile
			? [
					{
						files: resolved!,
						extensions: [],
					},
			  ]
			: [
					{
						files: ['svg-css-sprite.config'],
						extensions: ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'],
					},
			  ],
		cwd,
		defaults: { sprites: [] },
	});

	const result = await loader.load();

	return { cwd, config: result.config };
}
