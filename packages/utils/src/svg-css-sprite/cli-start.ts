import cac from 'cac';
import { consola } from 'consola';
import { green } from 'kolorist';
import { version } from '../../package.json';
import { createIconifyCollectionsIconsFactory } from './create-node-sprite';

export async function startCli(args: string[] = process.argv) {
	const cli = cac('svg-css-sprite-generator');

	cli.version(version)
		.option('-r, --root <path>', 'Root path')
		.option('-c, --config <path>', 'Path to config file')
		.help()
		.command('Iconify CSS SVG Sprite Generator')
		.action(() => run());

	cli.parse(args);
}

async function run() {
	consola.log(green(`Iconify CSS SVG Sprite Generator v${version}`));
	consola.start('Preparing to generate CSS SVG Sprites...');

	console.log(typeof createIconifyCollectionsIconsFactory);

	/*const root = cliOptions?.root ?? process.cwd();

	const { config } = await loadConfig<UserConfig>(root, cliOptions);*/

	consola.ready('CSS SVG Sprites generated');
}
