import { BuildEntry, defineBuildConfig } from 'unbuild';
import { exports } from './package.json';

const entries: BuildEntry[] = [];
const match = './lib/';

Object.keys(exports).forEach((key) => {
	if (key.slice(0, match.length) !== match) {
		return;
	}

	const importValue = exports[key]['import'];
	if (importValue === key + '.mjs') {
		const name = key.slice(match.length);
		entries.push({
			input: 'src/' + name,
			name,
		});
	}
});

entries.push({ input: 'src/svg-css-sprite/cli', name: 'svg-css-sprite/cli' });

export default defineBuildConfig({
	outDir: './lib',
	entries,
	clean: true,
	declaration: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
});
