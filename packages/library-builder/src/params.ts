export interface BuildParams {
	// Root directory
	root: string;

	// Source directory, relative to root
	source: string;

	// Target directory, relative to root
	target: string;

	// Clean up target directory, default = true
	cleanup?: boolean;

	// Rebuild CommonJS files with 'esbuild', default = false
	rebuildCommonJS?: boolean;

	// Update exports in package.json, default = true
	updateExports?: boolean;

	// Build script for 'tsc -b', must be present in package.json, such as 'build:source'
	// If null, builder will run 'tsc -b'
	buildScript?: string | null;
}

export type RequiredBuildParams = Required<BuildParams>;

const removeTrailing: (keyof Pick<BuildParams, 'source' | 'target'>)[] = [
	'source',
	'target',
];

/**
 * Clean up params
 */
export function cleanupParams(params: BuildParams): RequiredBuildParams {
	const result: RequiredBuildParams = {
		...params,

		// Default boolean values
		cleanup: params.cleanup !== false,
		rebuildCommonJS: !!params.rebuildCommonJS,
		updateExports: params.updateExports !== false,

		// Default build script
		buildScript: params.buildScript || null,
	};

	// Add trailing '/' to root
	if (result.root.slice(-1) !== '/') {
		result.root += '/';
	}

	// Remove trailing '/' from source and target
	removeTrailing.forEach((attr) => {
		const value = result[attr];
		if (value.slice(-1) === '/') {
			result[attr] = value.slice(0, value.length - 1);
		}
	});

	return result;
}
