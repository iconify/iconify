import { runAction } from './helpers/action';
import { addLinksToWorkspace } from './helpers/add-links';
import { cleanWorkspace } from './helpers/clean';
import { runNPMCommand } from './helpers/exec';
import { actionOptions, enablePrivateFilter } from './helpers/options';
import { removeLinksFromWorkspace } from './helpers/remove-links';

/**
 * All actions
 */
const actionFunctions: Record<string, () => void> = {
	link: () => {
		runAction('Creating/fixing symbolic links', addLinksToWorkspace);
	},
	unlink: () => {
		runAction('Removing symbolic links', removeLinksFromWorkspace);
	},
	clean: () => {
		runAction('Removing node_modules', cleanWorkspace);
	},
	install: () => {
		runAction('Installing dependencies', (workspace) => {
			runNPMCommand(workspace, ['install']);
			addLinksToWorkspace(workspace);
		});
	},
};

/**
 * Actions that require parameter
 */
interface ActionWithParam {
	action: string;
	param: string;
}
const actionWithParamsFunctions: Record<string, (param: string) => void> = {
	run: (param: string) => {
		runAction(`Running "npm run ${param}"`, (workspace) => {
			if (
				!actionOptions.ifPresent ||
				workspace.scripts.indexOf(param) !== -1
			) {
				runNPMCommand(workspace, ['run', param]);
			}
		});
	},
};

// Aliases
actionWithParamsFunctions['run-script'] = actionWithParamsFunctions['run'];

/**
 * Run code
 */
export function run() {
	// List of actions
	const actions: (string | ActionWithParam)[] = [];

	// Process args
	let nextActionParam: string | null = null;
	let nextOptionValue: string | null = null;
	process.argv.slice(2).forEach((arg) => {
		// Parameter for action with param
		if (nextActionParam !== null) {
			actions.push({
				action: nextActionParam,
				param: arg,
			});
			nextActionParam = null;
			return;
		}

		// Parameter for option with param
		if (nextOptionValue !== null) {
			switch (nextOptionValue) {
				case '--workspace':
				case '-w':
					actionOptions.workspaces.push(arg);
					break;

				case '--package':
				case '-p':
					actionOptions.packages.push(arg);
					break;
			}
			nextOptionValue = null;
			return;
		}

		// Options
		switch (arg) {
			case '--if-present':
				actionOptions.ifPresent = true;
				return;

			case '--silent':
				actionOptions.silent = true;
				return;

			case '--public':
				enablePrivateFilter(false);
				return;

			case '--private':
				enablePrivateFilter(true);
				return;
		}

		// Options with '='
		const argParts = arg.split('=');
		if (argParts.length > 1) {
			const cmd = argParts.shift();
			const value = argParts.join('=');
			switch (cmd) {
				case '--workspace':
				case '-w':
					actionOptions.workspaces.push(value);
					return;

				case '--package':
				case '-p':
					actionOptions.packages.push(value);
					return;
			}
		}

		// Action
		if (actionFunctions[arg] !== void 0) {
			actions.push(arg);
			return;
		}

		// Action with parameter
		if (actionWithParamsFunctions[arg] !== void 0) {
			nextActionParam = arg;
			return;
		}

		// Invalid argument
		throw new Error(`Invalid argument: ${arg}`);
	});

	// Make sure arguments list is complete
	if (nextActionParam !== null) {
		throw new Error(`Missing parameter for action: ${nextActionParam}`);
	}
	if (nextOptionValue !== null) {
		throw new Error(`Missing parameter for option: ${nextOptionValue}`);
	}

	// Run actions
	if (!actions.length) {
		throw new Error('Nothing to do');
	}
	actions.forEach((action) => {
		if (typeof action === 'string') {
			actionFunctions[action]();
		} else {
			actionWithParamsFunctions[action.action](action.param);
		}
	});
}
