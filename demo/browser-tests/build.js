const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const packagesDir = path.dirname(__dirname);

// List of commands to run
const commands = [];

// Parse command line
const compile = {
	core: false,
	iconify: false,
	lib: true,
	dist: true,
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

if (compile.dist && !fileExists(packagesDir + '/browser-tests/lib/node.js')) {
	compile.lib = true;
}

if (
	compile.lib &&
	(!fileExists(packagesDir + '/iconify/dist/iconify.js') ||
		!fileExists(packagesDir + '/iconify/lib/iconify.js'))
) {
	compile.iconify = true;
}

if (compile.iconify && !fileExists(packagesDir + '/core/lib/modules.js')) {
	compile.core = true;
}

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
Object.keys(compile).forEach((key) => {
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

// Update version number in package.json
const packageJSON = JSON.parse(
	fs.readFileSync(__dirname + '/package.json', 'utf8')
);
let iconifyVersion = packageJSON.devDependencies['@iconify/iconify'].replace(
	/[\^~]/g,
	''
);
if (packageJSON.version !== iconifyVersion) {
	console.log('Updated package version to', iconifyVersion);
	packageJSON.version = iconifyVersion;
	fs.writeFileSync(
		__dirname + '/package.json',
		JSON.stringify(packageJSON, null, '\t') + '\n',
		'utf8'
	);
}
