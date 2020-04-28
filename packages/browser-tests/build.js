const path = require('path');
const child_process = require('child_process');

// List of commands to run
const commands = [];

// Parse command line
const compile = {
	core: false,
	iconify: false,
	lib: true,
	dist: true,
};
process.argv.slice(2).forEach(cmd => {
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
				Object.keys(compile).forEach(key2 => {
					compile[key2] = key2 === key;
				});
				break;
		}
	}
});

// Compile core before compiling this package
if (compile.core) {
	commands.push({
		cmd: 'npm',
		args: ['run', 'build'],
		cwd: path.dirname(__dirname) + '/core',
	});
}

if (compile.iconify || compile.core) {
	commands.push({
		cmd: 'npm',
		args: ['run', 'build'],
		cwd: path.dirname(__dirname) + '/iconify',
	});
}

// Compile other packages
Object.keys(compile).forEach(key => {
	if (key !== 'core' && key !== 'iconify' && compile[key]) {
		commands.push({
			cmd: 'npm',
			args: ['run', 'build:' + key],
		});
	}
});

/**
 * Run next command
 */
const next = () => {
	const item = commands.shift();
	if (item === void 0) {
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
