import { promises as fs } from 'fs';

interface ExportRecord {
	require: string;
	import: string;
}

/**
 * Add './' to export
 */
function formatExport(path: string): string {
	return path.slice(0, 2) === './' ? path : './' + path;
}

/**
 * Update package.json
 */
export async function updatePackageJSON(
	root: string,
	target: string,
	files: string[]
) {
	const packageData = JSON.parse(
		await fs.readFile(root + 'package.json', 'utf8')
	);

	// Get all exports
	const data: Record<string, ExportRecord | string> = {
		'./*': './*',
	};
	if (packageData.main && packageData.module) {
		data['.'] = {
			require: formatExport(packageData.main),
			import: formatExport(packageData.module),
		};
	}

	const dirKeys: Set<string> = new Set();

	files.forEach((file) => {
		const key = formatExport(target + file);

		// Check for '/index'
		const parts = key.split('/');
		if (parts.pop() === 'index') {
			const dirKey = parts.join('/');
			dirKeys.add(dirKey);

			// Add entry for './foo' in addition to './foo/index' added below
			if (!data[dirKey]) {
				// Do not overwrite entry added as file
				data[dirKey] = {
					require: key + '.js',
					import: key + '.mjs',
				};
			}
		}

		// Add file
		if (data[key] && !dirKeys.has(key)) {
			throw new Error(`Duplicate entries for ${key} in exports`);
		}
		data[key] = {
			require: key + '.js',
			import: key + '.mjs',
		};
	});

	// Update package.json
	if (
		packageData['exports'] &&
		JSON.stringify(packageData['exports']) === JSON.stringify(data)
	) {
		// Nothing to update
		return;
	}

	packageData.exports = data;
	const content = JSON.stringify(packageData, null, '\t') + '\n';
	await fs.writeFile('package.json', content, 'utf8');
	console.log('Updated exports in package.json');
}
