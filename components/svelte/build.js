import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// List of commands to run
const commands = [];

// api-extractor command line
const extractor = (name) =>
	`api-extractor run --local --verbose --config api-extractor.${name}.json`;

// Parse command line
const compile = {
	tsc: true,
	bundles: true,
	api: true,
	finish: true,
};
process.argv.slice(2).forEach((cmd) => {
	if (cmd.slice(0, 2) !== '--') {
		return;
	}
	const parts = cmd.slice(2).split('-');
	if (parts.length === 2) {
		// Parse 2 part commands like --with-lib
		const key = parts.pop();
		if (compile[key] === void 0) {
			return;
		}
		switch (parts.shift()) {
			case 'with':
				// enable module
				compile[key] = true;
				break;

			case 'without':
				// disable module
				compile[key] = false;
				break;

			case 'only':
				// disable other modules
				Object.keys(compile).forEach((key2) => {
					compile[key2] = key2 === key;
				});
				break;
		}
	}
});

// Compile packages
Object.keys(compile).forEach((key) => {
	if (!compile[key]) {
		return;
	}
	switch (key) {
		case 'api':
			apiFiles().forEach((name) => {
				const cmd = extractor(name).split(' ');
				commands.push({
					cmd: cmd.shift(),
					args: cmd,
				});
			});
			break;

		case 'finish':
			commands.push(cleanup);
			break;

		default:
			commands.push({
				cmd: 'npm',
				args: ['run', 'build:' + key],
			});
	}
});

/**
 * Get all api-extractor.*.json files
 */
function apiFiles() {
	return readdirSync('.')
		.map((item) => {
			const parts = item.split('.');
			if (parts.pop() !== 'json' || parts.shift() !== 'api-extractor') {
				return '';
			}
			return parts.length === 1 ? parts[0] : '';
		})
		.filter((item) => item !== '');
}

/**
 * Run next command
 */
function next() {
	const item = commands.shift();
	if (item === void 0) {
		process.exit(0);
	}

	if (typeof item === 'function') {
		item();
		process.nextTick(next);
		return;
	}

	if (item.cwd === void 0) {
		item.cwd = '.';
	}

	const result = spawnSync(item.cmd, item.args, {
		cwd: item.cwd,
		stdio: 'inherit',
	});

	if (result.status === 0) {
		process.nextTick(next);
	} else {
		process.exit(result.status);
	}
}
next();

/**
 * Cleanup
 */
function cleanup() {
	// Merge TypeScript files
	const sourceDir = './src/';
	const distDir = './dist/';

	function createTypes() {
		// Get Svelte file, split it. Import and content should be separated by empty line
		const svelteParts = readFileSync(sourceDir + 'svelte.d.ts', 'utf8')
			.trim()
			.replace(/\r/g, '')
			.split('\n\n');
		if (svelteParts.length < 2) {
			throw new Error(
				'Error parsing svelte.d.ts. Imports and content should be separated by 2 new lines'
			);
		}
		const svelteImport = svelteParts.shift() + '\n\n';
		const svelteContent = '\n\n' + svelteParts.join('\n\n');

		// Merge files
		[
			// Full component
			{
				source: 'iconify.d.ts',
				target: 'index.d.ts',
			},
			{
				source: 'iconify.d.ts',
				target: 'Icon.svelte.d.ts',
			},
			// Offline component
			{
				source: 'offline-iconify.d.ts',
				target: 'offline.d.ts',
			},
			{
				source: 'offline-iconify.d.ts',
				target: 'OfflineIcon.svelte.d.ts',
			},
		].forEach((item) => {
			const content =
				svelteImport +
				readFileSync(distDir + item.source, 'utf8')
					.replace('export { }', '')
					.trim() +
				svelteContent;
			writeFileSync(distDir + item.target, content, 'utf8');
			console.log(`Created dist/${item.target}`);
		});
	}

	function copyComponents() {
		['Icon.svelte', 'OfflineIcon.svelte'].forEach((name) => {
			const content = readFileSync(sourceDir + name, 'utf8');
			writeFileSync(distDir + name, content, 'utf8');
			console.log(`Copied dist/${name}`);
		});
	}

	createTypes();
	copyComponents();
}
