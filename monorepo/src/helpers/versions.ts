import fs from 'fs';
import { addLinksToWorkspace } from './add-links';
import { addToPath, pathToString, relativePath } from './dirs';
import { runNPMCommand } from './exec';
import { consoleLog } from './log';
import { PackageInfo } from './types';
import { findWorkspaces } from './workspaces';

const props: string[] = [
	'dependencies',
	'devDependencies',
	'optionalDependencies',
];

/**
 * Change versions of local package
 */
export function updateVersions(workspace: PackageInfo) {
	// Find all workspaces
	const workspaces = findWorkspaces();

	// Get package.json
	const packageFilename = pathToString(
		addToPath(workspace.path, 'package.json')
	);

	let data: Record<string, unknown>;
	try {
		data = JSON.parse(fs.readFileSync(packageFilename, 'utf8'));
	} catch {
		return;
	}

	const updated: Set<string> = new Set();
	props.forEach((prop) => {
		const dependencies = data[prop];
		if (typeof dependencies !== 'object') {
			return;
		}

		// Find local packages
		workspaces.forEach((item) => {
			if (
				item.name === workspace.name ||
				item.private ||
				typeof dependencies[item.name] !== 'string'
			) {
				return;
			}

			const newVersion = item.version;
			const oldValue = dependencies[item.name] as string;

			// ^*
			if (oldValue.slice(0, 1) === '^') {
				const oldVersion = oldValue.slice(1);
				if (oldVersion !== newVersion) {
					// Change version
					dependencies[item.name] = '^' + newVersion;
					updated.add(item.name);
				}
				return;
			}

			// exact version
			if (oldValue.match(/^[0-9]/) && oldValue !== newVersion) {
				dependencies[item.name] = newVersion;
				updated.add(item.name);
			}
		});
	});

	if (!updated.size) {
		return;
	}

	// Update package.json
	const newContent = JSON.stringify(data, null, '\t') + '\n';
	fs.writeFileSync(packageFilename, newContent, 'utf8');
	consoleLog(
		`Updated dependencies in ${relativePath(packageFilename)}: ${Array.from(
			updated
		).join(', ')}`
	);

	// Reinstall dependencies to update package-lock.json
	runNPMCommand(workspace, ['install']);
	addLinksToWorkspace(workspace);
}
