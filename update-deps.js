const fs = require('fs');
const child_process = require('child_process');

// Directory where packages are
const packagesDir = __dirname + '/packages';

// package.json keys and install commands to install @latest versions of those dependencies
const packagesInstallList = [
	{
		prop: 'dependencies',
		cmd: '--save',
	},
	{
		prop: 'devDependencies',
		cmd: '--save-dev',
	},
];

// Packages to ignore for @latest install when peerDependency is detected
const ignorePeers = {
	react: ['react', 'react-dom', 'react-test-renderer', '@types/react'],
	vue: ['vue'],
};

// Ignore bugged modules: due to bug in rollup 2.x, rollup and its modules cannot be updated.
function canInstall(name) {
	if (name.split('-').shift() === 'rollup') {
		return false;
	}
	if (name.split('/').shift() === '@rollup') {
		return false;
	}
	return true;
}

// Special tags instead of @latest
const specialTags = {
	'vue': 'next',
	'vue-jest': 'next',
	'@vue/test-utils': 'next',
};

// Update modes
const modes = {
	// Standard update, matching existing version requirements
	update: false,
	// Installs @latest version of dependency, might cause issues, so test code after update
	install: false,
};

// Get list of all packages
const localPackagesMap = Object.create(null);
fs.readdirSync(packagesDir).forEach((file) => {
	try {
		const data = JSON.parse(
			fs.readFileSync(`${packagesDir}/${file}/package.json`, 'utf8')
		);
		if (typeof data.name === 'string') {
			localPackagesMap[data.name] = file;
		}
	} catch (err) {
		// console.error(err);
	}
});
const localPackages = Object.keys(localPackagesMap);
const localDirs = Object.values(localPackagesMap);
console.log('Local packages:');
console.log(
	localPackages
		.map((name) => '\t' + localPackagesMap[name] + ': ' + name)
		.join('\n')
);

// Get list of directories to parse
const parseDirs = [];
process.argv.slice(2).forEach((cmd) => {
	if (cmd.slice(0, 2) === '--') {
		// --all
		if (cmd === '--all') {
			localDirs.forEach(addDirToParse);
			return;
		}

		// Command: --install or --update
		const key = cmd.slice(2);
		if (modes[key] !== void 0) {
			modes[key] = true;
			return;
		}
		invalidParam(cmd);
	}
	if (cmd.slice(0, 1) === '-') {
		invalidParam(cmd);
	}

	// By package name: update-deps @iconify/core
	if (localPackagesMap[cmd] !== void 0) {
		addDirToParse(localPackagesMap[cmd]);
		return;
	}

	// By directory name: update-deps core
	if (localDirs.indexOf(cmd) !== -1) {
		addDirToParse(cmd);
		return;
	}

	invalidParam(cmd);
});

if (!parseDirs.length) {
	usage();
	return;
}
if (!modes.install) {
	modes.update = true;
}
next();

/**
 * Parse next directory
 */
function next() {
	const dir = parseDirs.shift();
	if (dir === void 0) {
		return;
	}

	parse();
	process.nextTick(next);

	function parse() {
		// Update dependencies
		if (modes.update) {
			update(dir);
		}

		// Install @latest versions of everything
		if (!modes.install) {
			return;
		}

		// Get package.json
		const packageJSON = JSON.parse(
			fs.readFileSync(packagesDir + '/' + dir + '/package.json', 'utf8')
		);

		// Get list of packages to ignore
		let ignoreList = localPackages.slice(0);
		if (packageJSON.peerDependencies !== void 0) {
			Object.keys(packageJSON.peerDependencies).forEach((peer) => {
				if (ignorePeers[peer] === void 0) {
					throw new Error(
						`Unknown peer dependency "${peer}" in ${dir}`
					);
				}
				ignoreList = ignoreList.concat(ignorePeers[peer]);
			});
		}

		// Get dependencies
		packagesInstallList.forEach((item) => {
			const prop = item.prop;
			if (packageJSON[prop] === void 0) {
				return;
			}

			const packages = Object.keys(packageJSON[prop]).filter(
				(item) => canInstall(item) && ignoreList.indexOf(item) === -1
			);
			if (!packages.length) {
				return;
			}

			// Update all packages
			exec(
				packagesDir + '/' + dir,
				'npm',
				['install', item.cmd].concat(
					packages.map((item) => {
						return (
							item +
							(specialTags[item] === void 0
								? '@latest'
								: '@' + specialTags[item])
						);
					})
				)
			);
		});
	}
}

/**
 * Update dependencies
 */
function update(dir) {
	exec(packagesDir + '/' + dir, 'npm', ['update']);
}

/**
 * Execute command
 */
function exec(cwd, cmd, args) {
	// Execute stuff
	console.log(
		`Executing in ${cwd.slice(__dirname.length)}: ${cmd} ${args.join(' ')}`
	);
	const result = child_process.spawnSync(cmd, args, {
		cwd,
		stdio: 'inherit',
	});

	if (result.status !== 0) {
		process.exit(result.status);
	}

	// Update symbolic links
	child_process.spawnSync('npm', ['run', 'link'], {
		__dirname,
		stdio: 'inherit',
	});
}

/**
 * Add directory to list of directories to parse
 */
function addDirToParse(dir) {
	if (parseDirs.indexOf(dir) === -1) {
		parseDirs.push(dir);
	}
}

/**
 * Print usage
 */
function usage() {
	console.log('Usage: node update-deps [list of packages to update]');
	console.log('--all updates all packages');
	console.log(
		'--install installs @latest versions of dependencies. Use carefully and check code after using it!'
	);
	console.log('--update updates dependencies (npm update)');
}

/**
 * Invalid parameter error. Print usage instructions and throw error
 */
function invalidParam(cmd) {
	usage();
	throw new Error(`Invalid parameter: ${cmd}`);
}
