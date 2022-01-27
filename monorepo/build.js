/**
 * Build package
 */
const fs = require('fs');
const child_process = require('child_process');

const rootDir = __dirname;
const mainFile = rootDir + '/lib/index.js';

// Check if required modules in same monorepo are available
const fileExists = (file) => {
	try {
		fs.statSync(file);
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Build scripts, return imported main file on success
 */
function build() {
	return new Promise((fulfill, reject) => {
		// List of commands to execute
		const commands = [];

		// Build script
		if (!fileExists(mainFile)) {
			commands.push({
				cmd: 'npm',
				args: ['run', 'build'],
				cwd: rootDir,
			});
		}

		// Install dependencies before building
		if (!fileExists(rootDir + '/node_modules/typescript')) {
			commands.unshift({
				cmd: 'npm',
				args: ['install'],
				cwd: rootDir,
			});
		}

		/**
		 * Run next command
		 */
		function next() {
			const item = commands.shift();
			if (item === void 0) {
				const functions = require(mainFile);
				fulfill(functions);
				return;
			}

			if (item.cwd === void 0) {
				item.cwd = rootDir;
			}

			const result = child_process.spawnSync(item.cmd, item.args, {
				cwd: item.cwd,
				stdio: 'inherit',
			});

			if (result.status === 0) {
				process.nextTick(next);
			} else {
				reject(result.status);
				return;
			}
		}
		next();
	});
}

module.exports = {
	build,
};
