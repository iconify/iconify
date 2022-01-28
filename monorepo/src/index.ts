import { runAction } from './helpers/action';
import { addLinksToWorkspace } from './helpers/add-links';
import { cleanWorkspace } from './helpers/clean';
import { runNPMCommand } from './helpers/exec';
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
			runNPMCommand(workspace, ['run', param]);
		});
	},
};

/**
 * Run code
 */
export function run() {
	// List of actions
	const actions: (string | ActionWithParam)[] = [];

	// Process args
	let nextActionParam: string | null = null;
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
