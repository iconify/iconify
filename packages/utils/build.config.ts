import { BuildEntry, defineBuildConfig } from 'unbuild';
import packageJSON from './package.json';

const entries: BuildEntry[] = [];
const exportsList = packageJSON['exports'];
const match = './lib/';

Object.keys(exportsList).forEach((key) => {
	if (key.slice(0, match.length) !== match) {
		return;
	}

	const importValue = exportsList[key]['import'];
	if (importValue === key + '.mjs') {
		const name = key.slice(match.length);
		entries.push({
			input: 'src/' + name,
			name,
		});
	}
});

export default defineBuildConfig({
	outDir: './lib',
	entries,
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
	},
});
