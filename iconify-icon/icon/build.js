/* eslint-disable */
const fs = require('fs');
const child_process = require('child_process');

// List of commands to run
const commands = [];

// Parse command line
const compile = {
	lib: true,
	dist: true,
	api: true,
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

// Check if required modules in same monorepo are available
const fileExists = (file) => {
	try {
		fs.statSync(file);
	} catch (e) {
		return false;
	}
	return true;
};

if (compile.dist && !fileExists('./lib/index.js')) {
	compile.lib = true;
}

if (compile.api && !fileExists('./lib/index.d.ts')) {
	compile.lib = true;
}

// Compile packages
Object.keys(compile).forEach((key) => {
	if (compile[key]) {
		commands.push({
			cmd: 'npm',
			args: ['run', 'build:' + key],
		});
	}
});

/**
 * Update types before exit
 */
function updateTypes() {
	const filename = 'dist/iconify-icon.d.ts';
	const search = 'HTMLElementTagNameMap';
	const search2 = 'interface IconifyIconHTMLElement extends';
	const code = `
/**
 * Add custom element to global elements list
 */
declare global {
	interface HTMLElementTagNameMap {
		'iconify-icon': IconifyIconHTMLElement;
	}
}
`;

	let data;
	try {
		data = fs.readFileSync(filename, 'utf8');
	} catch {
		// Missing
		if (compile.api) {
			throw new Error('Cannot clean up types file');
		}
		return;
	}

	// Check if code already exists
	if (data.indexOf(search) !== -1) {
		return;
	}

	// Check if required type exists
	if (data.indexOf(search2) === -1) {
		throw new Error('Cannot find required interface');
	}

	// Add code
	fs.writeFileSync(filename, data + code, 'utf8');
	console.log('Updated', filename);
}

/**
 * Run next command
 */
const next = () => {
	const item = commands.shift();
	if (item === void 0) {
		updateTypes();
		process.exit(0);
	}

	if (item.cwd === void 0) {
		item.cwd = __dirname;
	}

	const result = child_process.spawnSync(item.cmd, item.args, {
		cwd: item.cwd,
		stdio: 'inherit',
	});

	if (result.status === 0) {
		process.nextTick(next);
	} else {
		process.exit(result.status);
	}
};
next();
