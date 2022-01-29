type PackageTypeFilter = 'private' | 'public' | 'all';

/**
 * Interface for options
 */
export interface ActionOptions {
	// Run command if present, applies to 'run' and 'run-script'
	ifPresent: boolean;

	// Filter packages by `private` property, undefined if not set
	private?: PackageTypeFilter;

	// Filter by workspace
	workspaces: string[];

	// Filter by package name
	packages: string[];

	// Silent
	silent: boolean;
}

/**
 * Options
 */
export const actionOptions: ActionOptions = {
	ifPresent: false,
	workspaces: [],
	packages: [],
	silent: false,
};

/**
 * Toggle private filter
 */
export function enablePrivateFilter(value: boolean) {
	const newValue: PackageTypeFilter = value ? 'private' : 'public';

	if (!actionOptions.private) {
		// Not set: set to new value
		actionOptions.private = newValue;
		return;
	}

	if (actionOptions.private !== newValue) {
		// Enable all
		actionOptions.private = 'all';
	}
}
